import React from 'react'
import assets from '../assets/assets'

const chatBar = () => {
  return (
    <div className='bg-orange-50 relative'>
        <div className='flex items-center justify-between pl-7  pr-7 border-b-1 border-grey-600 mt-4 pb-2' >
            <div className='flex'>
                <img className='h-12 rounded-full object-cover' src={assets.profile_img} alt="" />
                <p className='flex items-center ml-5 text-xl'>Rohan 
                    <img className='h-3 ml-2' src={assets.green_dot} alt="green dot" />
                    </p>
            </div>
            <img className='h-10' src={assets.help_icon} alt="menu" />
        </div>
        <div>
    {/* This the chat here from the sender side and reciever side*/ }
    <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        
          <div  className='flex justify-end'>
            <div className='flex items-end gap-2 max-w-[70%] flex-row-reverse' >
              {/* Avatar */}
              <img 
                className='h-8 w-8 rounded-full object-cover' 
                src={assets.profile_img} 
                alt="avatar" 
              />
              
              {/* Message Bubble */}
              <div className='flex flex-col  items-end'>
                <div className='px-4 py-2 rounded-2xl bg-blue-500 text-white rounded-br-md'>
                  <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe, nihil.</p>
                </div>
                <span className='text-xs text-gray-500 mt-1'>12:10 AM</span>
              </div>
            </div> 
          </div>
      </div>

            <div className='absolute bottom-4 left-6 flex items-center bg-white w-[90%] justify-between rounded-md p-2' >
                <input className='w-[85%] outline-none' type="text" placeholder='send a message'/>
                <div className='flex gap-3 items-center'>
                    <input type="file" id="image" accept='image/png, image/jpeg' hidden/>
                    <label htmlFor="image">
                        <img className='h-5' src={assets.gallery_icon} alt="" />
                    </label>
                    <img className='h-5' src={assets.send_button} alt="" />
                </div>
                
            </div>
        </div>
      
    </div>
  )
}

export default chatBar
