import React from 'react'
import LeftSideBar from '../components/leftSideBar'
import ChatBar from '../components/chatBar'
import RightSideBar from '../components/rightSideBar'

const Chat = () => {
  return (
    <div className=' w-screen h-screen flex items-center justify-center bg-linear-to-t from-sky-500 to-indigo-500'>
      <div className='w-[80%] h-[85%] grid grid-cols-[1fr_2fr_1fr]'>
          <LeftSideBar/>
          <ChatBar/>
          <RightSideBar/>
      </div>
    </div>
  )
}

export default Chat
