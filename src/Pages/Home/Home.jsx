
import './Home.css';
import { Link, useNavigate } from "react-router-dom";
import profile from "../../assets/emptyprofile.jpg";
import { useAuth } from '../../AuthProvider.jsx';
import { useEffect } from 'react';

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const plusSign = "https://cdn-icons-png.flaticon.com/512/7187/7187487.png"
  useEffect(() => {
    if (user == null) {
      navigate("/login");
    }
  });
  return (
    <div className="home-container">
      {/* Banner Section */}
       <div className="banner">
        <h1 className="company-name">Band4Band</h1>
      </div>
     
      {/* Post Button (Top Left) */}
        {user?.artist && <Link to="/post">
          <img src={plusSign} alt="Post" className="post-button" />
        </Link>}

      {/* Profile Button (Top Right) */}
      <Link to="/profile">
        <img src={user?.profile_picture} alt="Profile" className="profile-button" />
      </Link>

      {/* Navigation Bar */}
      <nav className="nav-bar">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/account">Account</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/discover">Discover</Link>
        <Link to="/login">Login</Link>
      </nav>

    
      {/* Home Feed (Instagram-Style Grid) */}
      <div className="feed">
        <h2>Explore Posts</h2>
        <div className="post-container">
          <div className="post">Post 1</div>
          <div className="post">Post 2</div>
          <div className="post">Post 3</div>
          <div className="post">Post 4</div>
          <div className="post">Post 5</div>
          <div className="post">Post 6</div>
        </div>
      </div>
    </div>
  );
}

export default Home;
