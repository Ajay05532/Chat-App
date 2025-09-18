import { useState, useEffect, useCallback } from 'react';
import AppContext from './appContext';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const AppContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const navigate = useNavigate();

  const loadUserData = useCallback(async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      setUserData(userData);

      if (userData)  navigate('/chat'); 
    //   else navigate('/profile')

      // Update last seen immediately
      await updateDoc(userRef, {
        lastSeen: new Date().toISOString(),
      })
      

    } catch (error) {
      console.log(error);
    }
  }, [navigate]);

  useEffect(() => {
    if(userData){
      const chatRef = doc(db, "chats", userData.id);
      const unSub = onSnapshot(chatRef, async (res) =>{
        const chatItems = res.data().chatData
        const tempData = [];
        for(const item of chatItems){
          const userRef  = doc(db, 'users', item.rId)
          const userSnap = await getDoc(userRef);
          const userData = userSnap.date();
          tempData.push(...item, userData);
        }
        setChatData(tempData.sort((a,b) => b.updatedAt-a.updatedAt))
      })
      return () =>{
        unSub();
      }
    }
  
  }, [userData])
  

  // Background heartbeat to keep lastSeen fresh
  useEffect(() => {
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          lastSeen: new Date().toISOString(),
        });
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
