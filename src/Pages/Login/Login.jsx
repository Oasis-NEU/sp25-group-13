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
        <button className="login-button">Login as Listener</button>
        {activeComponent === "login-as-artist" && (
          <div className = "artist-login">
            <h1>test</h1>
          </div>
        )}
      </div>
    </>

  )
}

export default Login
