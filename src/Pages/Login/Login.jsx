import './Login.css'
import {useState, useEffect, useRef} from 'react';




function Login() {
  const [activeComponent, setActiveComponent] = useState('');
  return (
    <>
    <div className="login-container">
      <h1 className="login-header">Login</h1>
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
    </>

  )
}

export default Login
