import React, { useState, useEffect, useRef, useContext } from "react";
import assets from "../assets/assets";
import AppContext from "../context/appContext";
import { db, storage } from "../config/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";

const ChatBar = () => {
  // State is sourced from the AppContext for chat data
  const { userData, chatUser, messages } = useContext(AppContext);

  // Local state for handling the message input and image previews
  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);

  // Effect to scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Effect to clear the input fields when the user switches to a different chat
  useEffect(() => {
    setInput("");
    setImageFile(null);
    setImagePreview(null);
  }, [chatUser]);

  // Handles the selection of an image file from the user's device
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handles sending the message (text and/or image) to Firestore
  const handleSendMessage = async () => {
    const isTextMessage = input.trim() !== "";
    const isImageMessage = imageFile !== null;

    if (!isTextMessage && !isImageMessage) return; // Do nothing if there's no content
    if (!chatUser || !chatUser.messageId) {
      toast.error("No chat selected");
      return;
    }

    try {
      let imageUrl = null;
      // 1. If an image is attached, upload it to Firebase Storage
      if (isImageMessage) {
        const storageRef = ref(
          storage,
          `chat_images/${Date.now()}_${imageFile.name}`
        );
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // 2. Construct the new message object
      const newMessage = {
        senderId: userData.id,
        text: isTextMessage ? input : "",
        img: imageUrl, // Will be null if no image was sent
        createdAt: new Date(), // Use regular Date instead of serverTimestamp
      };

      // 3. Add the new message to the 'messageList' array in the corresponding Firestore document
      const messageDocRef = doc(db, "messages", chatUser.messageId);
      await updateDoc(messageDocRef, {
        messageList: arrayUnion(newMessage),
      });

      // 4. Update the last message in both users' chat lists
      const currentUserChatsRef = doc(db, 'chats', userData.id);
      const otherUserChatsRef = doc(db, 'chats', chatUser.rId);
      
      const lastMessageText = isTextMessage ? input : "📷 Image";
      const updateTime = Date.now();

      // Update current user's chat list
      await updateDoc(currentUserChatsRef, {
        chatData: arrayUnion({
          messageId: chatUser.messageId,
          rId: chatUser.rId,
          lastMessage: lastMessageText,
          updatedAt: updateTime,
          messageSeen: true
        })
      });

      // Update other user's chat list
      await updateDoc(otherUserChatsRef, {
        chatData: arrayUnion({
          messageId: chatUser.messageId,
          rId: userData.id,
          lastMessage: lastMessageText,
          updatedAt: updateTime,
          messageSeen: false
        })
      });

    } catch (error) {
      toast.error("Failed to send message.");
      console.error("Error sending message: ", error);
    } finally {
      // 5. Reset the input form
      setInput("");
      setImageFile(null);
      setImagePreview(null);
    }
  };

  // Allows sending the message by pressing the 'Enter' key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents a new line in the input
      handleSendMessage();
    }
  };

  // --- Render Logic ---

  // Display a welcome/prompt screen if no chat is currently selected
  if (!chatUser) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-5 text-gray-500">
        <img className="w-16" src={assets.logo} alt="logo" />
        <p className="text-xl">Select a chat to start messaging</p>
      </div>
    );
  }

  // Render the main chat interface
  return (
    <div className="bg-orange-50 flex flex-col h-full">
      {/* Header: Displays the other user's name and avatar */}
      <div className="flex items-center justify-between px-7 border-b border-gray-300 py-4 bg-white flex-shrink-0 min-h-[80px]">
        <div className="flex items-center">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={chatUser.avatar || assets.avatar_icon}
            alt="avatar"
          />
          <div className="ml-4">
            <p className="flex items-center text-xl font-semibold">
              {chatUser.name || 'Unknown User'}
              <img
                className="h-3 ml-2"
                src={assets.green_dot}
                alt="online status"
              />
            </p>
          </div>
        </div>
        <img
          className="h-8 w-8 cursor-pointer"
          src={assets.help_icon}
          alt="help"
        />
      </div>

      {/* Messages Container: Displays the list of messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages && Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg, index) => {
            if (!msg || !msg.senderId) return null;
            
            const isSentByMe = msg.senderId === userData.id;
            return (
              <div
                key={index}
                className={`flex ${
                  isSentByMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end gap-2 max-w-[70%] ${
                    isSentByMe ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <img
                    className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                    src={isSentByMe ? (userData.avatar || assets.avatar_icon) : (chatUser.avatar || assets.avatar_icon)}
                    alt="avatar"
                  />
                  <div
                    className={`flex flex-col ${
                      isSentByMe ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isSentByMe
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.img && (
                        <img
                          src={msg.img}
                          alt="sent-media"
                          className="max-w-[200px] rounded-lg mb-2"
                        />
                      )}
                      {msg.text && (
                        <p className="text-sm break-words">{msg.text}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {msg.createdAt && msg.createdAt instanceof Date
                        ? msg.createdAt.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : msg.createdAt && typeof msg.createdAt.toDate === 'function'
                        ? msg.createdAt.toDate().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "sending..."}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box: The form for sending new messages */}
      <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
        {imagePreview && (
          <div className="relative w-24 h-24 mb-2 p-2 border rounded-lg">
            <img
              src={imagePreview}
              alt="media-preview"
              className="w-full h-full object-cover rounded"
            />
            <button
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              onClick={() => {
                setImagePreview(null);
                setImageFile(null);
              }}
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
            <input
              type="file"
              id="imageFile"
              accept="image/png, image/jpeg"
              hidden
              onChange={handleImageChange}
            />
            <label htmlFor="imageFile" className="cursor-pointer">
              <img
                className="h-5 w-5"
                src={assets.gallery_icon}
                alt="gallery"
              />
            </label>
            <img
              onClick={handleSendMessage}
              className="h-5 w-5 cursor-pointer"
              src={assets.send_button}
              alt="send"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBar;