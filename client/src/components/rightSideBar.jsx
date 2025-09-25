import React, { useContext, useMemo } from 'react'
import assets from '../assets/assets'
import { logout } from '../config/firebase' 
import AppContext from '../context/appContext'

const RightSideBar = () => {
  const { chatUser, messages, userData } = useContext(AppContext)

  // Extract media from messages
  const chatMedia = useMemo(() => {
    if (!messages || messages.length === 0) return []
    
    return messages
      .filter(msg => msg.img) // Only messages with images
      .map(msg => msg.img) // Extract the image URLs
      .reverse() // Show newest first
  }, [messages])

  // --- MODIFIED SECTION START ---
  // This logic now correctly shows the person you're chatting with,
  // and falls back to your own profile (userData) only when no chat is active.

  const isChatSelected = !!chatUser;

  const displayName = isChatSelected ? chatUser.name : userData?.name || 'User';
  const displayAvatar = isChatSelected ? chatUser.avatar : userData?.avatar;
  const displayBio = isChatSelected ? `@${chatUser.username}` : userData?.bio || "Hey I'm using Chat App";
  
  // Also fixed a bug here: was returning {} which has no .length property. Should be [].
  const displayMedia = isChatSelected ? chatMedia : []; 

  // --- MODIFIED SECTION END ---

  return (
    <div className='bg-slate-900 h-full flex flex-col'>

      {/* Profile Section - Fixed height */}
      <div className='border-b border-gray-600 text-gray-300 w-full flex items-center flex-col py-5 flex-shrink-0'>
        <img
          className='w-20 h-20 rounded-full object-cover'
          // Added a fallback to a default image in case both avatars are missing
          src={displayAvatar || assets.avatar_icon} 
          alt="profile" 
        />
        <p className='mt-2 font-semibold'>{displayName}</p>
        <span className='mt-1 text-sm text-gray-400'>
          {displayBio}
        </span>
        {isChatSelected && (
          <span className='mt-1 text-xs text-green-400'>
            {chatUser.lastSeen ? `Last seen: ${new Date(chatUser.lastSeen).toLocaleString()}` : 'Online'}
          </span>
        )}
      </div>

      {/* Media Section - Flexible height with proper scrolling */}
      <div className='flex-1 flex flex-col min-h-0'>
        {/* Media Header - Fixed */}
        <div className='flex-shrink-0 p-3 border-b border-gray-700'>
          <p className='text-white font-medium'>
            Media {displayMedia.length > 0 && `(${displayMedia.length})`}
          </p>
        </div>
        
        {/* Scrollable Media Content */}
        <div 
          className='flex-1 overflow-y-auto p-3'
          style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none',  /* IE and Edge */
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none; /* Chrome, Safari, and Opera */
            }
          `}</style>
          
          {displayMedia.length > 0 ? (
            <div className='grid grid-cols-3 gap-2'>
              {displayMedia.map((media, index) => (
                <img 
                  key={index} 
                  className='w-full aspect-square object-cover rounded cursor-pointer hover:opacity-80 transition-opacity' 
                  src={media} 
                  alt={`media-${index}`}
                  onClick={() => {
                    window.open(media, '_blank');
                  }} 
                />
              ))}
            </div>
          ) : (
            <div className='flex items-center justify-center h-full'>
              <p className='text-gray-400 text-sm text-center'>
                {isChatSelected ? 'No media shared in this chat yet' : 'Your shared media will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Logout Button - Fixed at bottom */}
      <div className='p-4 flex-shrink-0 border-t border-gray-700'>
        <button
          className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={logout}
        > 
          Log Out
        </button>
      </div>
    </div>
  )
}

export default RightSideBar;