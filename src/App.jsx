import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import About from './Pages/About'
import Account from './Pages/Account View'
import Calendar from './Pages/Calendar'
import Discover from './Pages/Discover'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Profile from './Pages/Profile'
import Search from './Pages/Search'

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
