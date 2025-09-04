import LeftSideBar from '../components/leftSideBar'
import ChatBar from '../components/chatBar'
import RightSideBar from '../components/rightSideBar'
import React, { useState } from 'react'

const Chat = () => {

  const [mediaItems, setMediaItems] = useState([]);

  // Function to add new media to the collection
  const handleMediaAdd = (imageUrl) => {
    setMediaItems(prev => [...prev, imageUrl]);
  };

  return (
    <div className=' w-screen h-screen flex items-center justify-center bg-linear-to-t from-sky-500 to-indigo-500'>
      <div className='w-[80%] h-[85%] grid grid-cols-[1fr_2fr_1fr]'>
          <LeftSideBar/>
          <ChatBar onMediaAdd={handleMediaAdd}/>
          <RightSideBar mediaItems={mediaItems}/>
      </div>
    </div>
  )
}

export default Chat
