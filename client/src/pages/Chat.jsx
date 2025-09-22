import LeftSideBar from "../components/leftSideBar";
import ChatBar from "../components/chatBar";
import RightSideBar from "../components/rightSideBar";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext";

const Chat = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const { chatData, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  // Function to add new media to the collection
  const handleMediaAdd = (imageUrl) => {
    setMediaItems((prev) => [...prev, imageUrl]);
  };

  useEffect(() => {
    if(chatData && userData){
      setLoading(false)
    }
  },[chatData, userData])

  return (

    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-t from-sky-500 to-indigo-500">
      {loading ? (

        <p className="text-white text-xl">Loading...</p>
      ) : (
        <div className="w-[80%] h-[85%] grid grid-cols-[1fr_2fr_1fr] rounded-xl overflow-hidden shadow-2xl">
          <LeftSideBar />
          <ChatBar onMediaAdd={handleMediaAdd} />
          <RightSideBar mediaItems={mediaItems} />
        </div>
      )}
    </div>
  );
};

export default Chat;
