import React, { useState } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { logout, db } from '../config/firebase'; 
import { collection, getDocs, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';

const LeftSideBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/profile');
    setIsMenuOpen(false); // Close the menu after clicking
  };
  const inputHandler = async (e) =>{
try {
  const input = e.target.value;
  const userRef = collection(db, 'users');
  const q = query(userRef,where("username", "==", input.toLowerCase()));
  const querySnap = await getDocs(q);
  if(!querySnap.empty) console.loh(querySnap.docs[0].data())
} catch (error) {
  toast.error(error.message)
}
  }

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
                {/* --- FIX 2: Call the handler function --- */}
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
        {/* Placeholder Content */}
        <div className='text-gray-400 text-center p-4'>Your chat list will appear here.</div>
      </div>
    </div>
  );
};

export default LeftSideBar;

