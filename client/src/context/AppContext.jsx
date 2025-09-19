import { useState, useEffect, useCallback } from 'react';
import AppContext from './appContext';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const AppContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const navigate = useNavigate();

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

      // Update last seen immediately
      await updateDoc(userRef, {
        lastSeen: new Date().toISOString(),
      });

    } catch (error) {
      console.log(error);
    }
  }, [navigate]);

  useEffect(() => {
    if(userData){
      const chatRef = doc(db, "chats", userData.id);
      const unSub = onSnapshot(chatRef, async (res) => {
        try {
          const chatItems = res.data()?.chatData || [];
          const tempData = [];
          
          for(const item of chatItems){
            const userRef = doc(db, 'users', item.rId);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
              const userData = userSnap.data(); // Fixed: was .date() instead of .data()
              tempData.push({...item, ...userData}); // Fixed: spread both item and userData
            }
          }
          setChatData(tempData.sort((a,b) => b.updatedAt - a.updatedAt));
        } catch (error) {
          console.error("Error fetching chat data:", error);
          setChatData([]);
        }
      });
      
      return () => {
        unSub();
      }
    }
  }, [userData]);

  // Background heartbeat to keep lastSeen fresh
  useEffect(() => {
    const interval = setInterval(async () => {
      if (auth.currentUser) {
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
  }, []);

  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;