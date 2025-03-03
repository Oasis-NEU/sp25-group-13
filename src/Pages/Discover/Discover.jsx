import './Discover.css'
import { Link } from "react-router-dom";

function Discover() {
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
        <h1>Discover New Bands</h1>
        <p>Explore local musicians and find new bands near you!</p>
        
        {/* Example of Band List */}
        <div className="band-list">
          <div className="band-card">
            <h3>Band Name 1</h3>
            <p>Genre: Rock</p>
            <p>Location: Boston</p>
            <button>Follow</button>
          </div>
          <div className="band-card">
            <h3>Band Name 2</h3>
            <p>Genre: Jazz</p>
            <p>Location: New York</p>
            <button>Follow</button>
          </div>
          {/* Add more band cards */}
        </div>
      </div>
    </div>
  )
}

export default Discover;
