import './About.css';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthProvider.jsx';
import { useEffect } from 'react';
import profile from "../../assets/emptyprofile.jpg"; // make sure this path is correct

function About() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="about-container graffiti">
      {/* Banner Section */}
      <div className="banner">
        <h1 className="company-name">Band4Band</h1>
      </div>

      {/* Profile Button (Top Right) */}
      <Link to="/profile">
        <img src={user?.profile_picture || profile} alt="Profile" className="profile-button" />
      </Link>

      {/* Navigation Bar */}
      <nav className="nav-bar">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/discover">Discover</Link>
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
          {[
            ["Shelby Snyder", "https://www.linkedin.com/in/shelby-snyder-277a94268"],
            ["Colin Quigley", "https://www.linkedin.com/in/colin-quigley-845a44330/"],
            ["Jack Senders", "https://www.linkedin.com/in/jack-senders-4b6525119/"],
            ["Joseph Odetayo", "https://www.linkedin.com/in/joseph-odetayo-35273b22a/"],
            ["Sophia Bovino", "https://www.linkedin.com/in/sophia-bovino-aa797b1b6/"],
            ["Hector Batista", "https://www.linkedin.com/in/hectorbatistajr/"]
          ].map(([name, link], index) => (
            <div className="member" key={index}>
              <p>{name}</p>
              <a href={link} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
