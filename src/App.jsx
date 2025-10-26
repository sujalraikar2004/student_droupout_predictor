import React from 'react'
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SIgnIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home.jsx';

const App = () => {
  return (
     <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path='/SignIn' element={<SignIn/>} />
      <Route path='/signup' element={<SignUp/>} />
      <Route path='/home' element={<Home/>} />
     </Routes>
  )
}

export default App