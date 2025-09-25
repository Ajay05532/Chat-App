import React, { useState, useEffect, useRef, useContext } from "react";
import assets from "../assets/assets";
import AppContext from "../context/appContext";
import { db, storage } from "../config/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";

const ChatBar = () => {
  const { userData, chatUser, messages } = useContext(AppContext);
  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setInput("");
    setImageFile(null);
    setImagePreview(null);
  }, [chatUser]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSendMessage = async () => {
    const isTextMessage = input.trim() !== "";
    const isImageMessage = imageFile !== null;

    if (!isTextMessage && !isImageMessage) return;
    if (!chatUser || !chatUser.messageId) {
      toast.error("No chat selected");
      return;
    }

    try {
      let imageUrl = null;
      if (isImageMessage) {
        const storageRef = ref(
          storage,
          `chat_images/${Date.now()}_${imageFile.name}`
        );
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const newMessage = {
        senderId: userData.id,
        text: isTextMessage ? input : "",
        img: imageUrl,
        createdAt: new Date(),
      };

      const messageDocRef = doc(db, "messages", chatUser.messageId);
      await updateDoc(messageDocRef, {
        messageList: arrayUnion(newMessage),
      });

      const updateLastMessage = async (userId) => {
        const userChatsRef = doc(db, 'chats', userId);
        const userChatsSnap = await getDoc(userChatsRef);

        if (userChatsSnap.exists()) {
          const chats = userChatsSnap.data().chatData;
          const chatIndex = chats.findIndex(c => c.messageId === chatUser.messageId);

          if (chatIndex !== -1) {
            chats[chatIndex].lastMessage = isTextMessage ? input : "📷 Image";
            chats[chatIndex].updatedAt = Date.now();
            chats[chatIndex].messageSeen = (userId === userData.id);
            
            await updateDoc(userChatsRef, { chatData: chats });
          }
        }
      };

      await Promise.all([
        updateLastMessage(userData.id),
        updateLastMessage(chatUser.rId),
      ]);

    } catch (error) {
      toast.error("Failed to send message.");
      console.error("Error sending message: ", error);
    } finally {
      setInput("");
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!chatUser) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-5 text-gray-500 bg-orange-50">
        <img className="w-16" src={assets.logo} alt="logo" />
        <p className="text-xl">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    // The root container must be a flex column with a defined height
    <div className="h-full flex flex-col bg-orange-50">
      {/* HEADER - Fixed height, does not shrink */}
      <div className="h-20 flex items-center justify-between px-7 border-b border-gray-300 bg-white shrink-0">
        <div className="flex items-center">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={chatUser.avatar || assets.avatar_icon}
            alt="avatar"
          />
          <div className="ml-4">
            <p className="flex items-center text-xl font-semibold text-gray-800">
              {chatUser.name || 'Unknown User'}
              <img className="h-3 ml-2" src={assets.green_dot} alt="online status" />
            </p>
          </div>
        </div>
        <img className="h-8 w-8 cursor-pointer" src={assets.help_icon} alt="help" />
      </div>

      {/* MESSAGES AREA - This is the key part */}
      {/* 'flex-1' makes it take all available space. */}
      {/* 'min-h-0' prevents it from overflowing its parent in a flex context. */}
      {/* 'overflow-y-auto' makes it scrollable only when needed. */}
      <div className="flex-1 min-h-0 p-4 overflow-y-auto bg-orange-50 chat-messages">
        <style jsx>{`
            .chat-messages::-webkit-scrollbar {
              display: none; /* For Chrome, Safari, and Opera */
            }
            .chat-messages {
              -ms-overflow-style: none; /* For IE and Edge */
              scrollbar-width: none; /* For Firefox */
            }
        `}</style>
        <div className="space-y-4">
          {messages?.map((msg, index) => {
              if (!msg || !msg.senderId) return null;
              const isSentByMe = msg.senderId === userData.id;
              return (
                <div key={index} className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-end gap-2 max-w-[70%] ${isSentByMe ? "flex-row-reverse" : "flex-row"}`}>
                    <img
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                      src={isSentByMe ? (userData.avatar || assets.avatar_icon) : (chatUser.avatar || assets.avatar_icon)}
                      alt="avatar"
                    />
                    <div className={`flex flex-col ${isSentByMe ? "items-end" : "items-start"}`}>
                      <div className={`px-4 py-2 rounded-2xl ${isSentByMe ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none"}`}>
                        {msg.img && <img src={msg.img} alt="sent-media" className="max-w-[200px] rounded-lg mb-2" />}
                        {msg.text && <p className="text-sm break-words">{msg.text}</p>}
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "sending..."}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* INPUT AREA - Fixed height, does not shrink */}
      <div className="h-auto p-4 bg-white border-t border-gray-200 shrink-0">
        {imagePreview && (
          <div className="relative w-24 h-24 mb-2 p-2 border rounded-lg">
            <img src={imagePreview} alt="media-preview" className="w-full h-full object-cover rounded" />
            <button
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              onClick={() => { setImagePreview(null); setImageFile(null); }}
            >
              &times;
            </button>
          </div>
        )}
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input
            className="flex-1 bg-transparent outline-none text-sm"
            type="text"
            placeholder="Send a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="flex gap-4 items-center ml-2">
            <input type="file" id="imageFile" accept="image/png, image/jpeg" hidden onChange={handleImageChange} />
            <label htmlFor="imageFile" className="cursor-pointer">
              <img className="h-5 w-5" src={assets.gallery_icon} alt="gallery" />
            </label>
            <img onClick={handleSendMessage} className="h-5 w-5 cursor-pointer" src={assets.send_button} alt="send" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBar;