import LeftSideBar from "../components/leftSideBar";
import ChatBar from "../components/chatBar";
import RightSideBar from "../components/rightSideBar";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext";

const Chat = () => {
  const { chatData, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(chatData && userData){
      setLoading(false)
    }
  },[chatData, userData])

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-t from-sky-500 to-indigo-500">
      {loading ? (
        <p className="text-white"> Loading ...</p>
      ) : (
        // KEY CHANGE: Switched from 'grid' to 'flex'
        // We now explicitly define the width of each section
        <div className="w-[80%] h-[85%] flex flex-row overflow-hidden rounded-lg shadow-lg">
          <div className="w-1/4 flex-shrink-0">
            <LeftSideBar />
          </div>
          <div className="w-1/2 flex-shrink-0">
            <ChatBar />
          </div>
          <div className="w-1/4 flex-shrink-0">
            <RightSideBar />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;