import './Home.css';
import { Link } from "react-router-dom";
import profile from "../../assets/emptyprofile.jpg";

const TopStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100vw",
  height: "200px",
  backgroundColor: "black"
}

function Home() {
  return (
    <div>
      {/* Header and Profile Button */}
      <div class="Top" style={TopStyle}>
        <h1 className="header">Band4Band</h1>
        <Link className="profilebutton" to="/profile">
        <img src={profile} alt="Go to Profile" width="100" /></Link>
      </div>

      {/* Navigation Links */}
      <div className="Links">
      <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/account">Account</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/discover">Discover</Link>
        <Link to="/login">Login</Link>
        <Link to="/search">Search</Link>
      </div>

     {/* Home Feed */}
      <div className="Bottom">
        <h1>Bottom Feed</h1>
      </div>
    </div>
  );
}

export default Home;