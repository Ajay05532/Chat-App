import React, { useEffect } from 'react'
import './index.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Chat from './pages/Chat';
import UpdateProfile from './pages/UpdateProfile';
import NotFound from './pages/NotFound';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

const App = () => {

  const navigate = useNavigate();
  
  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, async (user)=>{
      if(user){
        navigate('/chat')
        console.log(user);
        
      }else{
        navigate('/')
      }
    })
    return () => unsubscribe()
  }, [navigate])

  return (
    <>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/profile' element={<UpdateProfile />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
    </>
  )
}

export default App
