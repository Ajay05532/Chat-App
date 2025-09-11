import React, { useState } from 'react'
import assets from '../assets/assets'
import firebase from 'firebase/compat/app';

const LeftSideBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  
  return (
    <div className='bg-slate-900  h-full flex flex-col'>
      {/* Header Section */}
      <div className='flex gap-7 justify-between items-center mt-5 px-5'>
        <img className='h-10 w-32' src={assets.logo} alt="logo" />

        {/* --- Dropdown Menu Container --- */}
        <div className="relative">
          {/* 2. Changed event handler to onClick to toggle the menu */}
          <img 
            className='h-6 w-6 cursor-pointer hover:opacity-80' 
            src={assets.menu_icon} 
            alt="menu" 
            onClick={() => setIsMenuOpen(!isMenuOpen)} // <-- KEY CHANGE HERE
          />

          {/* 3. Conditional rendering (this stays the same) */}
          {isMenuOpen && (
            <div className='absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10'>
              <div className='py-1'>
                <p className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'>Edit profile</p>
                <hr className='border-gray-200' />
                <p className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'
                onClick={firebase.logout}
                >Logout</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className='px-5 mt-5'>
        <input 
          type="text"
          placeholder='Search greatstack..' 
          className="w-full bg-blue-900 text-white p-3 rounded-lg placeholder-gray-300 focus:outline-none focus:bg-blue-800 transition duration-300"
        />
      </div>

      {/* Chat List */}
      <div className='flex-1 overflow-y-auto mt-4 px-2'>
        {/* Chat Item 1 */}
        <div className='flex items-center gap-3 p-3 hover:bg-slate-800 cursor-pointer rounded-lg mx-3 mb-2'>
          <img 
            className='h-12 w-12 rounded-full object-cover' 
            src={assets.pic1} 
            alt="profile" 
          />
          <div className='flex-1 text-white'>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium text-sm'>GreatStack</h3>
              <span className='text-xs text-gray-400'>12:30 PM</span>
            </div>
            <p className='text-xs text-gray-400 truncate'>hello</p>
          </div>
        </div>

        {/* Chat Item 2 - Example */}
        <div className='flex items-center gap-3 p-3 hover:bg-slate-800 cursor-pointer rounded-lg mx-3 mb-2'>
          <img 
            className='h-12 w-12 rounded-full object-cover' 
            src={assets.pic3}
            alt="profile" 
          />
          <div className='flex-1 text-white'>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium text-sm'>John Doe</h3>
              <span className='text-xs text-gray-400'>11:45 AM</span>
            </div>
            <p className='text-xs text-gray-400 truncate'>How are you doing?</p>
          </div>
        </div>

        {/* Chat Item 3 - Example */}
        <div className='flex items-center gap-3 p-3 hover:bg-slate-800 cursor-pointer rounded-lg mx-3 mb-2'>
          <img 
            className='h-12 w-12 rounded-full object-cover' 
            src={assets.pic4} 
            alt="profile" 
          />
          <div className='flex-1 text-white'>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium text-sm'>Sarah Wilson</h3>
              <span className='text-xs text-gray-400'>Yesterday</span>
            </div>
            <p className='text-xs text-gray-400 truncate'>See you tomorrow!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftSideBar