import React, { useContext, useEffect } from 'react';
import './index.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Chat from './pages/Chat';
import UpdateProfile from './pages/UpdateProfile';
import NotFound from './pages/NotFound';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { ToastContainer } from 'react-toastify';
import AppContext from './context/appContext';

const App = () => {
  const navigate = useNavigate();
  const { loadUserData } = useContext(AppContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadUserData(user.uid); // loadUserData itself will navigate
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate, loadUserData]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<UpdateProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
