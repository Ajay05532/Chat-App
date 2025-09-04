import React from 'react'
import './index.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Chat from './pages/Chat';
import UpdateProfile from './pages/UpdateProfile';
import NotFound from './pages/NotFound';

const App = () => {

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
