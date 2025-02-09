import './Login.css'
import { Link } from "react-router-dom";

function Login() {

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
      <h1 className="login-header">Login</h1>
        <div className="button-container"></div>
        <button className="login-button">Login as Artist</button>
        <button className="login-button">Login as Listener</button>
      </div>
  </div>
  )
}

export default Login
