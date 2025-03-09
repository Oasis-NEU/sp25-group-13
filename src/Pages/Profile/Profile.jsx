import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthProvider.jsx';
import { useEffect, useState } from 'react';
import './Profile.css';

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [aboutText, setAboutText] = useState("Tell us about yourself...");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null; // Prevent rendering if user is null

  return (
    <div className="profile-container">
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

      {/* Profile Content */}
      <div className="profile-content">
        <img className="profile-pic" src="https://via.placeholder.com/150" alt="Profile" />
        <h2 className="profile-username">{user?.name || "User Name"}</h2>

        {/* Editable About Section */}
        <textarea 
          className="about-textbox"
          value={aboutText}
          onChange={(e) => setAboutText(e.target.value)}
        />

        <button className="save-button" onClick={() => alert("Saved!")}>Save</button>
      </div>
    </div>
  );
}

export default Profile;