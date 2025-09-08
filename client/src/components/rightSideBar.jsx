import React from 'react'
import assets from '../assets/assets'
import firebase from '../config/firebase'

const RightSideBar = ({mediaItems = [] }) => {

  const allMedia = [
    assets.pic1,
    assets.pic2,
    assets.pic3,
    assets.pic4,
    assets.pic1,
    assets.pic2,
    assets.pic3,
    assets.pic4,
    ...mediaItems
  ]
  return (
    // Add overflow-hidden here
    <div className='bg-slate-900 h-full flex flex-col overflow-hidden'>

      {/* Profile Section */}
      <div className='border-b border-gray-600 text-gray-300 w-full flex items-center flex-col shrink-0 py-5'>
        <img
          className='w-20 h-20 rounded-full object-cover'
          src={assets.profile_img} alt="profile" />
        <p className='mt-2 font-semibold'>Rohan</p>
        <span className='mt-1 text-sm text-gray-400'>
          Hey I'm using Chat App
        </span>
      </div>

      {/* Media Section */}
      <div
        className='flex-1 overflow-y-auto min-h-0' // min-h-0 is still crucial
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

        <p className='p-3 text-white font-medium'> Media {mediaItems.length > 0 && `(${allMedia.length})`}</p>
        <div className='flex flex-wrap gap-3 px-3'>

          {allMedia.map((media, index) =>(
            <img 
              key={index} 
              className='w-20 h-15 rounded cursor-pointer hover:opacity-80 transition-opacity' 
              src={media} 
              alt={`media-${index}`}
              onClick={() => {
                // Optional: Add click handler to view full size
              window.open(media, '_blank');
              }} 
            />

          ))}
        </div>
        {allMedia.length === 0 && (
          <p className='text-gray-400 text-sm px-3'>No media shared yet</p>
        )}
      </div>
        <div>
        <button
            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition duration-300 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={firebase.logout}
            > 
              Log Out
            </button>
        </div>
    </div>
  )
}

export default RightSideBar