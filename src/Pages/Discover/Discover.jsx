import './Discover.css';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthProvider.jsx';
import { useEffect, useState } from 'react';  // Don't forget to import useState
import profile from '../../assets/emptyprofile.jpg'; // Reuse profile image from Home
import { supabase } from '../../supabaseClient.js';
import { isAuthError } from '@supabase/supabase-js';

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
  const [displayArtists, setDisplayArtists] = useState([]);
  const [genre, setGenre] = useState("");
  const [table, setTable] = useState("");
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (user == null) {
      navigate("/login");
    } else if (user?.artist) {
      setTable("Artist Account")
    } else {
      setTable("ListenerAccount")
    }
      getArtists();
  }, [navigate]);

  // Fetch artists based on selected genre
  const getArtists = async () => {
    const { data, error } = await supabase
      .from("Artist Account")
      .select("*");
    
      if (error) {
        console.error("Error fetching artists:", error);
        return;
      }
      setArtists(data);
      setDisplayArtists(data);
  };

  const follow = async (artist) => {
    if (!artist || !user) {
      console.log("Missing artist or user!");
      return;
    }
  
    console.log(`Trying to follow artist: ${artist.username}`);
  
    try {
      // 1. Get current followers array
      const { data: artistData, error: artistError } = await supabase
        .from("Artist Account")
        .select("followers")
        .eq("id", artist.id)
        .single();
  
      if (artistError) {
        console.error("Artist fetch error:", artistError);
        return;
      }
  
      console.log("Current artist followers:", artistData.followers);
  
      const currentFollowers = artistData.followers || [];
      const currentFollowing = user.following || [];
  
      // 2. Update followers
      let updatedFollowers=[];
      let updatedFollowing=[];
      if (!currentFollowers.includes(user?.id)) {
        updatedFollowers = [...currentFollowers, user.id];
      } else {
        updatedFollowers = currentFollowers;
      }
      if (!currentFollowing.includes(user?.id)) {
        updatedFollowing = [...user.following, artist.id];
      } else {
        pdatedFollowing = user.following;
      }
  
      const { error: updateArtistError } = await supabase
        .from("Artist Account")
        .upsert({ id: artist?.id, followers: updatedFollowers});

        const { error: updateFollowingError } = await supabase
        .from(table)
        .upsert({ id: user?.id, following: updatedFollowing});
  
      if (updateArtistError) {
        console.error("Update artist followers error:", updateArtistError);
        return;
      }

      if (updateFollowingError) {
        console.error("Update user following error:", updateFollowingError);
        return;
      }
      setUser((prevUser) => ({
        ...prevUser,
        following: [...prevUser.following, artist.id],
      }));

      console.log(`Successfully followed ${artist.username}!`);
  
    } catch (err) {
      console.error("Unexpected error in follow:", err);
    }
  };
  

  // Fetch artists whenever genre changes
  useEffect(() => {
    if (genre == "") {
    setDisplayArtists(artists);
    } else {
      console.log(artists);
    const filteredArtists = artists.filter(artist => {
      if(artist.genres) {
        return artist.genres.includes(genre);
      }
    });
    setDisplayArtists(filteredArtists);
  }
  }, [genre]);

  useEffect(() => {
    const filteredArtists = artists.filter(artist => {
      return artist.username.toLowerCase().includes(search.toLowerCase());
    });
    setDisplayArtists(filteredArtists);
}, [search]);

  return (
    <div className="discover-container">
      {/* Banner (reused from Home/About) */}
      <div className="banner">
        <h1 className="company-name">Band4Band</h1>
      </div>

      {/* Profile Button (reused from Home) */}
      <Link to="/profile">
        <img src={user?.profile_picture} alt="Profile" className="profile-button" />
      </Link>

      {/* Navigation Bar (reused from Home/About) */}
      <div className="nav-bar">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/discover">Discover</Link>
      </div>

      {/* Discover Content */}
      <div className="discover-content">
        <h2 className="discover-title">Discover Artists</h2>

        {/* Filters/Search Bar */}
        <div className="filters">
          <input id="search" type="text" placeholder="Search artists..." onChange={(e) => setSearch(e.target.value)}/>
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
        {Array.isArray(displayArtists) && displayArtists.length > 0 ? (
        displayArtists.map((artist) => {
          if (user?.id == artist?.id) {
            return;
          } else {
            return (
            <div className="band-card">
              <img src={artist.profile_picture || profile} alt={artist.username} />
              <Link to={`/account?account=${encodeURIComponent(artist.id)}`}>
                {artist.username}
              </Link>
              {artist.genres ? <p>{artist.genres.join(", ")}</p> : <p></p>}
              <button onClick={() => follow(artist)}>{user?.following.includes(artist?.id) ? "Following" : "Follow"}</button>
            </div>
            );
          }
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