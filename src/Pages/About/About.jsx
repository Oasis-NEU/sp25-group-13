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
      {/* Banner Section */}
      <div className="banner">
        <h1 className="company-name">Band4Band</h1>
      </div>

      {/* Navigation Bar */}
      <nav className="nav-bar">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/account">Account</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/discover">Discover</Link>
        <Link to="/login">Login</Link>
        <Link to="/search">Search</Link>
      </nav>

      {/* About Section */}
      <div className="about-content">
        <h2>About Us</h2>
        <p>
          Welcome to Band4Band! We are a group of young software developers with a goal to bring our community together through music. 
          Band4Band was built for all the artists, just like us, who are aspiring to do their craft professionally and need a platform 
          to showcase their talent. Join the Band4Band community today!
        </p>
      </div>

      {/* Meet the Team Section */}
      <div className="team">
        <h2>Meet the Team</h2>
        <div className="team-grid">
          <div className="member">
            <p>Shelby Snyder</p>
            <a href="https://www.linkedin.com/in/shelby-snyder-277a94268" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
          <div className="member">
            <p>Colin Quigley</p>
            <a href="https://www.linkedin.com/in/colin-quigley-845a44330/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
