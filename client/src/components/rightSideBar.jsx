import React from 'react'
import assets from '../assets/assets'

const rightSideBar = () => {
  return (
    <div className='bg-slate-900'>
      <div className='border-b-1 text-gray-300 max-h-[40%] w-full flex items-center flex-col mt-5 border-gray-600' >
            <img 
            className='w-30 rounded-full'
            src={assets.profile_img} alt="" />
            <p className='mt-2'>Rohan</p>
            <span
            className='mt-2 mb-2'>
            Hey i'm using chat App</span>
      </div>
      <div>
            <p className='m-2 text-white'>Media</p>
      </div>
    </div>
  )
}

export default rightSideBar
