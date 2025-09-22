import { useState, useEffect, useCallback } from 'react';
import AppContext from './appContext';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const AppContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState([]);
  const navigate = useNavigate();
  const [messagesId, setMessagesId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);

  const loadUserData = useCallback(async (uid, shouldNavigate = false) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      setUserData(userData);

      // Only navigate if explicitly requested and user data exists
      if (userData && shouldNavigate) {
        navigate('/chat'); 
      }

      // Update last seen only if user document exists
      if (userData) {
        await updateDoc(userRef, {
          lastSeen: new Date().toISOString(),
        });
      }

    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, [navigate]);

  // Effect to listen for chat data changes
  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "chats", userData.id);
      const unSub = onSnapshot(chatRef, async (res) => {
        try {
          const chatItems = res.data()?.chatData || [];
          const tempData = [];
          
          for (const item of chatItems) {
            const userRef = doc(db, 'users', item.rId);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
              const userData = userSnap.data();
              // Merge chat item data with user data
              tempData.push({
                ...item,
                name: userData.name,
                avatar: userData.avatar,
                username: userData.username,
                bio: userData.bio,
                lastSeen: userData.lastSeen
              });
            }
          }
          setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
        } catch (error) {
          console.error("Error fetching chat data:", error);
          setChatData([]);
        }
      });
      
      return () => {
        unSub();
      };
    }
  }, [userData]);

  // Effect to listen for messages when a chat is selected
  useEffect(() => {
    if (messagesId) {
      const messageRef = doc(db, "messages", messagesId);
      const unSub = onSnapshot(messageRef, (res) => {
        try {
          const messageData = res.data();
          if (messageData && messageData.messageList) {
            setMessages(messageData.messageList);
          } else {
            setMessages([]);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
          setMessages([]);
        }
      });
      
      return () => {
        unSub();
      };
    } else {
      setMessages([]);
    }
  }, [messagesId]);

  // Background heartbeat to keep lastSeen fresh
  useEffect(() => {
    const interval = setInterval(async () => {
      if (auth.currentUser && userData) { // Only update if user data exists
        try {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          await updateDoc(userRef, {
            lastSeen: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Error updating lastSeen:", error);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [userData]); // Add userData as dependency

  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
    messages,
    setMessages,
    messagesId,
    setMessagesId,
    chatUser,
    setChatUser
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;