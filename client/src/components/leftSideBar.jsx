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
} from "firebase/firestore";
import { toast } from "react-toastify";
import AppContext from "../context/appContext";

const LeftSideBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Get user data and the function to set the active chat from context
  const {
    userData,
    chatData,
    chatUser,
    setChatUser,
    setMessagesId,
    messagesId,
  } = useContext(AppContext);

  const [foundUser, setFoundUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // --- Menu Handlers ---
  const handleEditProfile = () => {
    navigate("/profile");
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  // --- Search Logic ---
  const handleSearch = async (e) => {
    const username = e.target.value.toLowerCase().trim();
    if (username) {
      setIsSearching(true);
      setFoundUser(null); // Reset previous search result
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnap = await getDocs(q);

        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          // Ensure the found user is not the current user
          let userExist = false;
          chatData?.forEach((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExist = true;
            }
          });
          if (!userExist) {
            setFoundUser(querySnap.docs[0].data());
          }
        }
        // Keep isSearching true even if no user found to show "No users found" message
      } catch (error) {
        toast.error("Error searching for user.");
        console.error("Search error:", error);
      }
      // Don't set isSearching to false here - keep it true while searching
    } else {
      setIsSearching(false);
      setFoundUser(null);
    }
  };

  // --- Chat Creation Logic ---
  const handleAddChat = async () => {
    if (!foundUser || !userData) return;

    try {
      // Create a reference for a new document in the 'messages' collection to get its ID
      const messagesCollectionRef = collection(db, "messages");
      const newMessageDocRef = doc(messagesCollectionRef);

      // Create an empty document in 'messages' to hold the conversation
      await setDoc(newMessageDocRef, {
        messageList: [],
        createdAt: serverTimestamp(),
      });

      // Add chat to the current user's chat list
      const currentUserChatsRef = doc(db, "chats", userData.id);
      await updateDoc(currentUserChatsRef, {
        chatData: arrayUnion({
          messageId: newMessageDocRef.id,
          rId: foundUser.id,
          lastMessage: "",
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      // Add chat to the other user's chat list
      const otherUserChatsRef = doc(db, "chats", foundUser.id);
      await updateDoc(otherUserChatsRef, {
        chatData: arrayUnion({
          messageId: newMessageDocRef.id,
          rId: userData.id,
          lastMessage: "",
          updatedAt: Date.now(),
          messageSeen: false, // New chat is unread for the recipient
        }),
      });

      toast.success("Chat added successfully!");
    } catch (error) {
      toast.error("Failed to add chat: " + error.message);
      console.error("Error adding chat:", error);
    } finally {
      // Reset search state
      setIsSearching(false);
      setFoundUser(null);
      const searchInput = document.querySelector(".search-input");
      if (searchInput) searchInput.value = "";
    }
  };

  // --- Chat Selection Logic ---
  const handleSelectChat = (chat) => {
    // Set the message ID to fetch messages
    setMessagesId(chat.messageId);

    // Create a proper selectedChat object with all necessary data
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
      {/* Header Section */}
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
                <p
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={handleEditProfile}
                >
                  Edit profile
                </p>
                <hr className="border-gray-200" />
                <p
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-5 mt-5">
        <input
          type="text"
          placeholder="Search by username..."
          className="search-input w-full bg-blue-900 text-white p-3 rounded-lg placeholder-gray-300 focus:outline-none focus:bg-blue-800 transition duration-300"
          onChange={handleSearch}
        />
      </div>

      {/* Content Area: Search Results or Chat List */}
      <div className="flex-1 overflow-y-auto mt-4 px-2">
        {isSearching ? (
          foundUser ? (
            // Display found user
            <div
              className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg mb-2 cursor-pointer hover:bg-slate-700"
              onClick={handleAddChat}
            >
              <img
                src={foundUser.avatar || assets.avatar_icon}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-white font-medium">{foundUser.name}</p>
                <p className="text-gray-400 text-sm">@{foundUser.username}</p>
                <p className="text-green-400 text-xs">Click to add chat</p>
              </div>
            </div>
          ) : (
            // Display searching or no results message
            <div className="text-gray-400 text-center p-4">
              <p>Searching for users...</p>
              <p className="text-sm mt-2">No users found with that username</p>
            </div>
          )
        ) : // Display existing chat list only when not searching
        chatData && Array.isArray(chatData) && chatData.length > 0 ? (
          <div>
            {chatData.map((item, index) => {
              // Add safety checks for item properties
              if (!item || typeof item !== "object") {
                return null;
              }

              return (
                <div
                  key={item.messageId || index}
                  className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg mb-2 cursor-pointer hover:bg-slate-700"
                  onClick={() => handleSelectChat(item)}
                >
                  <img
                    src={item.avatar || assets.avatar_icon}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium">
                      {item.name || "Unknown User"}
                    </p>
                    <p className="text-gray-400 text-sm truncate">
                      {item.lastMessage || "No messages yet"}
                    </p>
                  </div>
                  {!item.messageSeen && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // Display empty chat list message
          <div className="text-gray-400 text-center p-4">
            Your chat list will appear here.
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
