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
        <h1 className="Title">About Page</h1>
        <p className="Line">Band4Band is a social media platform for local artists to connect with fans, post about their events, interact with other groups, and show off media with the Artist account!</p>
        <p className="Line">It allows for fans to connect with artists, find shows near them, leave reviews on shows, and discover new local artists with the Listener account!</p>
      </div>
    </div>
  )
}

export default About
