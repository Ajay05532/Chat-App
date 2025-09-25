import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { logout, db } from "../config/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  arrayUnion,
  updateDoc,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import AppContext from "../context/appContext";

const LeftSideBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const {
    userData,
    chatData,
    setChatUser,
    setMessagesId,
  } = useContext(AppContext);

  const [foundUser, setFoundUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleEditProfile = () => {
    navigate("/profile");
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const handleSearch = async (e) => {
    const username = e.target.value.toLowerCase().trim();
    if (username) {
      setIsSearching(true);
      setFoundUser(null);
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnap = await getDocs(q);

        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          const foundUserData = querySnap.docs[0].data();
          
          // Check if user already exists in chat list
          const userAlreadyInChat = chatData?.some(
            (chat) => chat.rId === foundUserData.id
          );
          
          if (!userAlreadyInChat) {
            setFoundUser(foundUserData);
          } else {
            setFoundUser(null);
            toast.info("User already in your chat list");
          }
        } else if (querySnap.docs[0]?.data().id === userData.id) {
          // Prevent adding yourself
          setFoundUser(null);
          toast.error("You cannot add yourself to chat");
        } else {
          setFoundUser(null);
        }
      } catch (error) {
        toast.error("Error searching for user.");
        console.error("Search error:", error);
        setFoundUser(null);
      }
    } else {
      setIsSearching(false);
      setFoundUser(null);
    }
  };

  const handleAddChat = async () => {
    if (!foundUser || !userData) return;

    try {
      // Double-check that the user doesn't already exist in chat
      const userAlreadyInChat = chatData?.some(
        (chat) => chat.rId === foundUser.id
      );
      
      if (userAlreadyInChat) {
        toast.error("User already in your chat list");
        setFoundUser(null);
        setIsSearching(false);
        return;
      }

      // Check if chat document exists for both users to prevent duplicates
      const currentUserChatsRef = doc(db, "chats", userData.id);
      const otherUserChatsRef = doc(db, "chats", foundUser.id);
      
      const [currentUserChatsSnap, otherUserChatsSnap] = await Promise.all([
        getDoc(currentUserChatsRef),
        getDoc(otherUserChatsRef)
      ]);

      // Check for existing chat in both directions
      const currentUserChats = currentUserChatsSnap.exists() ? currentUserChatsSnap.data().chatData || [] : [];
      const otherUserChats = otherUserChatsSnap.exists() ? otherUserChatsSnap.data().chatData || [] : [];
      
      const existingChatInCurrent = currentUserChats.find(chat => chat.rId === foundUser.id);
      const existingChatInOther = otherUserChats.find(chat => chat.rId === userData.id);
      
      if (existingChatInCurrent || existingChatInOther) {
        toast.error("Chat already exists between these users");
        setFoundUser(null);
        setIsSearching(false);
        return;
      }

      // Create new message document
      const messagesCollectionRef = collection(db, "messages");
      const newMessageDocRef = doc(messagesCollectionRef);

      await setDoc(newMessageDocRef, {
        messageList: [],
        createdAt: serverTimestamp(),
      });

      // Add chat to current user's chat list
      await updateDoc(currentUserChatsRef, {
        chatData: arrayUnion({
          messageId: newMessageDocRef.id,
          rId: foundUser.id,
          lastMessage: "",
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      // Add chat to other user's chat list
      await updateDoc(otherUserChatsRef, {
        chatData: arrayUnion({
          messageId: newMessageDocRef.id,
          rId: userData.id,
          lastMessage: "",
          updatedAt: Date.now(),
          messageSeen: false,
        }),
      });

      toast.success("Chat added successfully!");
    } catch (error) {
      toast.error("Failed to add chat: " + error.message);
      console.error("Error adding chat:", error);
    } finally {
      setIsSearching(false);
      setFoundUser(null);
      const searchInput = document.querySelector(".search-input");
      if (searchInput) searchInput.value = "";
    }
  };

  const handleSelectChat = (chat) => {
    setMessagesId(chat.messageId);

    const selectedChatData = {
      messageId: chat.messageId,
      rId: chat.rId,
      name: chat.name,
      avatar: chat.avatar,
      username: chat.username,
      lastMessage: chat.lastMessage,
      messageSeen: chat.messageSeen,
    };

    setChatUser(selectedChatData);
  };

  return (
    <div className="bg-slate-900 h-full flex flex-col">
      <div className="flex justify-between items-center mt-5 px-5">
        <img className="h-10 w-auto" src={assets.logo} alt="logo" />
        <div className="relative">
          <img
            className="h-6 w-6 cursor-pointer hover:opacity-80"
            src={assets.menu_icon}
            alt="menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          />
          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <p className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={handleEditProfile}>
                  Edit profile
                </p>
                <hr className="border-gray-200" />
                <p className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 mt-5">
        <input
          type="text"
          placeholder="Search by username..."
          className="search-input w-full bg-blue-900 text-white p-3 rounded-lg placeholder-gray-300 focus:outline-none focus:bg-blue-800 transition duration-300"
          onChange={handleSearch}
        />
      </div>

      <div className="flex-1 overflow-y-auto mt-4 px-2">
        {isSearching ? (
          foundUser ? (
            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg mb-2 cursor-pointer hover:bg-slate-700" onClick={handleAddChat}>
              <img src={foundUser.avatar || assets.avatar_icon} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="text-white font-medium">{foundUser.name}</p>
                <p className="text-gray-400 text-sm">@{foundUser.username}</p>
                <p className="text-green-400 text-xs">Click to add chat</p>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-center p-4">
              <p>No user found with that username.</p>
            </div>
          )
        ) : chatData && Array.isArray(chatData) && chatData.length > 0 ? (
          <div>
            {chatData.map((item) => {
              if (!item || !item.messageId) {
                return null;
              }
              return (
                <div
                  key={item.messageId}
                  className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg mb-2 cursor-pointer hover:bg-slate-700"
                  onClick={() => handleSelectChat(item)}
                >
                  <img src={item.avatar || assets.avatar_icon} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-white font-medium">{item.name || "Unknown User"}</p>
                    <p className="text-gray-400 text-sm truncate">{item.lastMessage || "No messages yet"}</p>
                  </div>
                  {!item.messageSeen && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-400 text-center p-4">
            Your chat list will appear here.
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;