import './Discover.css';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthProvider.jsx';
import { useEffect, useState } from 'react';  // Don't forget to import useState
import profile from '../../assets/emptyprofile.jpg'; // Reuse profile image from Home
import { supabase } from '../../supabaseClient.js';

function Discover() {
  const genres = [
    "Pop", "Rock", "Hip Hop", "Jazz", "Classical", "Electronic", "Reggae", 
    "Country", "Blues", "Soul", "R&B", "Metal", "Punk", "Folk", 
    "Alternative", "Indie", "Latin", "Disco", "Techno", "House", 
    "EDM", "Dubstep", "Trance", "Reggaeton", "Ska", "Gospel", 
    "Funk", "World", "Opera", "Ambient", "Trap", "K-pop", "Synthwave", 
    "Grunge", "New Wave", "Salsa", "Dancehall", "Progressive Rock", 
    "Hard Rock", "Gothic", "Electronica", "Ambient", "Bluegrass", 
    "Tech House", "Psytrance", "Indie Rock", "Post-punk", "Vaporwave"
  ];

  const [artists, setArtists] = useState([]);
  const [genre, setGenre] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (user == null) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch artists based on selected genre
  const getArtists = async () => {
    if (genre == "") {
      const { data, error } = await supabase
      .from("Artist Account")
      .select("*");
    
      if (error) {
        console.error("Error fetching artists:", error);
        return;
      }
      console.log(data);
      setArtists(data);
   
    } else {
      console.log("only " + genre)
    const { data, error } = await supabase
      .from("Artist Account")
      .select("id, username, profile_picture, genres")
      .contains("genres", [genre]);
    
    if (error) {
      console.error("Error fetching artists:", error);
      return;
    }
    console.log(data)
    setArtists(data);
  }
  };

  const follow = async (artist) => {
      if (artist) {
        const { data, error } = await supabase
          .from("Artist Account")
          .upsert({ id: artist?.id, followers: [...artist?.followers, user?.id] });
        if (error) {
          throw new Error(error.message);
        }
        const { data2, error2 } = await supabase
          .from("ListenerAccount")
          .upsert({ id: user?.id, following: [...artist?.following, artist?.id] });
        if (error) {
          throw new Error(error.message);
        }
      }
  }

  // Fetch artists whenever genre changes
  useEffect(() => {
      getArtists();
  }, [genre]);  // Dependency array ensures the effect runs when genre changes

  return (
    <div className="discover-container">
      {/* Banner (reused from Home/About) */}
      <div className="banner">
        <h1 className="company-name">Band4Band</h1>
      </div>

      {/* Profile Button (reused from Home) */}
      <Link to="/profile">
        <img src={profile} alt="Profile" className="profile-button" />
      </Link>

      {/* Navigation Bar (reused from Home/About) */}
      <div className="nav-bar">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/account">Account</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/discover">Discover</Link>
        <Link to="/login">Login</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/search">Search</Link>
      </div>

      {/* Discover Content */}
      <div className="discover-content">
        <h2 className="discover-title">Discover Bands</h2>

        {/* Filters/Search Bar */}
        <div className="filters">
          <input type="text" placeholder="Search bands..." />
          <select onChange={(e) => setGenre(e.target.value)} value={genre}>
            <option value="">All Genres</option>
            {genres.map((genreOption) => {
              return (
                <option value={genreOption}>
                  {genreOption}
                </option>
              );
            })}
          </select>
        </div>
        
        {/* Band Grid */}
        <div className="band-grid">
        {console.log(user)}
        {Array.isArray(artists) && artists.length > 0 ? (
        artists.map((artist) => {
            return (
            <div key={artist.id} className="band-card">
              <img src={artist.profile_picture || profile} alt={artist.username} />
              <h3>{artist.username}</h3>
              <p>{artist.genres}</p>
              <button onClick={() => follow(artist)}>{user?.following.includes(artist.id) ? "Following" : "Follow"}</button>
            </div>
            );
          })
            ) :  (
              <p>No artists found.</p>
            )}
        </div>
      </div>
    </div>
  );
}

export default Discover;
