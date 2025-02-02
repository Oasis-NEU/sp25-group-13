import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import About from './Pages/About/About.jsx'
import Account from './Pages/Account View/Account.jsx'
import Calendar from './Pages/Calendar/Calendar.jsx'
import Discover from './Pages/Discover/Discover.jsx'
import Home from './Pages/Home/Home.jsx'
import Login from './Pages/Login/Login.jsx'
import Profile from './Pages/Profile/Profile.jsx'
import Search from './Pages/Search/Search.jsx'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home></Home>}></Route>
        <Route exact path="/about" element={<About></About>}></Route>
        <Route exact path="/account" element={<Account></Account>}></Route>
        <Route exact path="/calendar" element={<Calendar></Calendar>}></Route>
        <Route exact path="/discover" element={<Discover></Discover>}></Route>
        <Route exact path="/login" element={<Login></Login>}></Route>
        <Route exact path="/profile" element={<Profile></Profile>}></Route>
        <Route exact path="/search" element={<Search></Search>}></Route>
      </Routes>
    </Router>
  )
}

export default App
