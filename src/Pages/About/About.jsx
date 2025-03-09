import './About.css';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthProvider.jsx';
import { useEffect } from 'react';

function About() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user == null) {
      navigate("/login");
    }
  });
  return (
    <div className="about-container">
      {/* Navigation Links */}
      <div className="links">
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
      <div className="about-content">
        <h1>About Us</h1>
        <p>
          Welcome to Band4Band! We are a group of young software developers with a goal to bring together our community
          with music. Band4Band was built for all the artists who just like us, are aspiring to do their craft 
          professionally and need a platform to do that. Welcome to the Band4Band community! - Band4Band Team
        </p>

        {/* LinkedIn Profiles */}
        <div className="team">
          <h2>Meet the Team</h2>
          <div className="team-grid">
            <div className="member">
              <p>Shelby Snyder</p>
              <a href="https://www.linkedin.com/in/shelby-snyder-277a94268" target="_blank" rel="noopener noreferrer">
  LinkedIn
</a>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
