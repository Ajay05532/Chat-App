import React from 'react'
import assets from '../assets/assets'

const RightSideBar = () => {
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

        <p className='p-3 text-white font-medium'>Media</p>
        <div className='flex flex-wrap gap-3 px-3'>
          <img className='w-20 h-auto' src={assets.pic1} alt="media" />
          <img className='w-20 h-auto' src={assets.pic2} alt="media" />
          <img className='w-20 h-auto' src={assets.pic3} alt="media" />
          <img className='w-20 h-auto' src={assets.pic4} alt="media" />
          
        </div>
      </div>

    </div>
  )
}

export default RightSideBar