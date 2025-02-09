import './Login.css'
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

function Login() {
  const [activeComponent, setActiveComponent] = useState('');
  return (
    <div>
    {/* Navigation Links */}
    <div className="Links">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/account">Account</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/discover">Discover</Link>
        <Link to="/login">Login</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/search">Search</Link>
    </div>

    {/* Page Content */}
    <div className="Graphics">
      <h1>Login Page</h1>
    </div>
    <div className="login-container">

      <h1 className="login-header">Login as an Artist or Login as a Listener?</h1>
        <div className="button-container"></div>
        <button onClick={() => setActiveComponent('login-as-artist')}
        className="login-button">Login as Artist</button>
        <button onClick={() => setActiveComponent('login-as-listener')}
        className="login-button">Login as Listener</button>
        
        {activeComponent === "login-as-artist" && (
          <div className = "artist-login">
            <h1>Artist Name</h1>
          </div>
        )}

        {activeComponent === "login-as-listener" && (
          <div className = "listener-login">
            <h1>Listener Name</h1>
          </div>
        )}
      </div>
    </div>

  )
}

      

export default Login