import React, { useContext, useState } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { logout, db } from '../config/firebase'; 
import { collection, getDocs, query, where, arrayUnion, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import AppContext from '../context/appContext';

const LeftSideBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/profile');
    setIsMenuOpen(false); // Close the menu after clicking
  };
  
  const {userData, chatData} = useContext(AppContext);

  const [user, SetUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if(input){
        setShowSearch(true);
        const userRef = collection(db, 'users');
        const q = query(userRef,where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if(!querySnap.empty && querySnap.docs[0].data().id !== userData.id){
          SetUser(querySnap.docs[0].data());
        }
        else{
          SetUser(null)
        }
      }else{
        setShowSearch(false);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const addChat = async () => {
    try {
      if (!user || !userData) return;

      const messagesRef = collection(db, 'messages');
      const messagesDoc = doc(messagesRef);

      // Create new chat entry
      const chatEntry = {
        messageId: messagesDoc.id,
        lastMessage: "",
        rId: user.id,
        updatedAt: Date.now(),
        messageSeen: true
      };

      // Add to current user's chat list
      const userChatsRef = doc(db, 'chats', userData.id);
      await updateDoc(userChatsRef, {
        chatData: arrayUnion(chatEntry)
      });

      // Add to the other user's chat list
      const otherUserChatsRef = doc(db, 'chats', user.id);
      const otherUserChatEntry = {
        messageId: messagesDoc.id,
        lastMessage: "",
        rId: userData.id,
        updatedAt: Date.now(),
        messageSeen: true
      };
      
      await updateDoc(otherUserChatsRef, {
        chatData: arrayUnion(otherUserChatEntry)
      });

      // Clear search and hide search results
      setShowSearch(false);
      SetUser(null);
      // Clear the search input
      const searchInput = document.querySelector('input[type="text"]');
      if (searchInput) searchInput.value = '';

      toast.success("Chat added successfully!");

    } catch (error) {
      toast.error("Failed to add chat: " + error.message);
      console.error("Error adding chat:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    // The main App component's auth listener will handle navigating to the login page
  };

  return (
    <div className='bg-slate-900 h-full flex flex-col'>
      {/* Header Section */}
      <div className='flex justify-between items-center mt-5 px-5'>
        <img className='h-10 w-auto' src={assets.logo} alt="logo" />

        <div className="relative">
          <img 
            className='h-6 w-6 cursor-pointer hover:opacity-80' 
            src={assets.menu_icon} 
            alt="menu" 
            onClick={() => setIsMenuOpen(prev => !prev)}
          />

          {isMenuOpen && (
            <div className='absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10'>
              <div className='py-1'>
                <p 
                  className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'
                  onClick={handleEditProfile}
                >
                  Edit profile
                </p>
                <hr className='border-gray-200' />
                <p 
                  className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'
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
      <div className='px-5 mt-5'>
        <input 
          type="text"
          placeholder='Search...' 
          className="w-full bg-blue-900 text-white p-3 rounded-lg placeholder-gray-300 focus:outline-none focus:bg-blue-800 transition duration-300"
          onChange={inputHandler}
        />
      </div>

      {/* Chat List */}
      <div className='flex-1 overflow-y-auto mt-4 px-2'>
        {showSearch && user ? 
          <div className='flex items-center gap-3 p-3 bg-slate-800 rounded-lg mb-2 cursor-pointer hover:bg-slate-700' onClick={addChat}>
            <img 
              src={user.avatar || assets.avatar_icon} 
              alt="avatar" 
              className='w-10 h-10 rounded-full object-cover'
            />
            <div>
              <p className='text-white font-medium'>{user.name}</p>
              <p className='text-gray-400 text-sm'>@{user.username}</p>
            </div>
          </div>
        : showSearch ? 
          <div className='text-gray-400 text-center p-4'>No users found</div>
        : chatData && chatData.length > 0 ?
          <div>
            {chatData.map((item, index) => (
              <div 
                key={index} 
                className='flex items-center gap-3 p-3 bg-slate-800 rounded-lg mb-2 cursor-pointer hover:bg-slate-700'
                onClick={() => {
                  // Handle chat selection here
                  console.log("Selected chat:", item);
                }}
              >
                <img 
                  src={item.avatar || assets.avatar_icon} 
                  alt="avatar" 
                  className='w-10 h-10 rounded-full object-cover'
                />
                <div className='flex-1'>
                  <p className='text-white font-medium'>{item.name}</p>
                  <p className='text-gray-400 text-sm truncate'>{item.lastMessage || "No messages yet"}</p>
                </div>
                {!item.messageSeen && (
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                )}
              </div>
            ))}
          </div>
        :
          <div className='text-gray-400 text-center p-4'>Your chat list will appear here.</div>
        }
      </div>
    </div>
  );
};

export default LeftSideBar;