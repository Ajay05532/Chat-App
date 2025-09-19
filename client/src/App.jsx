import React, { useContext, useEffect } from 'react';
import './index.css';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const { loadUserData } = useContext(AppContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Load user data without automatic navigation
        await loadUserData(user.uid, false);
        
        // Only redirect to chat if user is on login page
        if (location.pathname === '/') {
          navigate('/chat');
        }
        // If user is on profile or chat page, let them stay there
      } else {
        // User is not logged in, redirect to login
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate, loadUserData, location.pathname]);

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