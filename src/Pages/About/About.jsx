import './About.css'
import { Link } from "react-router-dom";

function About() {

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
        <h1>About Page</h1>
      </div>
    </div>
  )
}

export default About
