
import {Routes, Route, Navigate } from "react-router-dom";
import About from './Pages/About/About.jsx';
import Account from './Pages/Account View/Account.jsx';
import Calendar from './Pages/Calendar/Calendar.jsx';
import Discover from './Pages/Discover/Discover.jsx';
import Home from './Pages/Home/Home.jsx';
import Login from './Pages/Login/Login.jsx';
import Profile from './Pages/Profile/Profile.jsx';
import Search from './Pages/Search/Search.jsx';
import AuthProvider from './AuthProvider.jsx';

function App() {
  return (
    <AuthProvider>
      <hr />
      <Routes>
        {/* Redirect from "/" to "/login" */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Main Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/account" element={<Account />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
      </Routes>
      </AuthProvider>
  );
}

export default App;