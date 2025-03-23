import './Discover.css';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthProvider.jsx';
import { useEffect, useState } from 'react';
import profile from '../../assets/emptyprofile.jpg';
import { supabase } from '../../supabaseClient.js';

function Discover() {
  const genres = [
    "Pop", "Rock", "Hip Hop", "Jazz", "Classical", "Electronic", "Reggae", 
    "Country", "Blues", "Soul", "R&B", "Metal", "Punk", "Folk", 
    "Alternative", "Indie", "Latin", "Disco", "Techno", "House", 
    "EDM", "Dubstep", "Trance", "Reggaeton", "Ska", "Gospel", 
    "Funk", "World", "Opera", "Ambient", "Trap", "K-pop", "Synthwave", 
    "Grunge", "New Wave", "Salsa", "Dancehall", "Progressive Rock", 
    "Hard Rock", "Gothic", "Electronica", "Bluegrass", 
    "Tech House", "Psytrance", "Indie Rock", "Post-punk", "Vaporwave"
  ];

  const [artists, setArtists] = useState([]);
  const [displayArtists, setDisplayArtists] = useState([]);
  const [genre, setGenre] = useState("");
  const [search, setSearch] = useState("");
  const [table, setTable] = useState("");
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setTable(user.artist ? "Artist Account" : "ListenerAccount");
      getArtists();
    }
  }, [user]);

  const getArtists = async () => {
    const { data, error } = await supabase.from("Artist Account").select("*");
    if (error) {
      console.error("Error fetching artists:", error);
      return;
    }
    setArtists(data);
    setDisplayArtists(data);
  };

  const follow = async (artist) => {
    if (!artist || !user) return;

    const { data: artistData, error: artistError } = await supabase
      .from("Artist Account")
      .select("followers")
      .eq("id", artist.id)
      .single();

    if (artistError) {
      console.error("Artist fetch error:", artistError);
      return;
    }

    const currentFollowers = artistData.followers || [];
    const currentFollowing = user.following || [];

    const updatedFollowers = currentFollowers.includes(user.id)
      ? currentFollowers
      : [...currentFollowers, user.id];

    const updatedFollowing = currentFollowing.includes(artist.id)
      ? currentFollowing
      : [...currentFollowing, artist.id];

    const { error: artistUpdateError } = await supabase
      .from("Artist Account")
      .upsert({ id: artist.id, followers: updatedFollowers });

    const { error: userUpdateError } = await supabase
      .from(table)
      .upsert({ id: user.id, following: updatedFollowing });

    if (artistUpdateError || userUpdateError) {
      console.error("Error updating follow info:", artistUpdateError || userUpdateError);
      return;
    }

    setUser(prev => ({ ...prev, following: updatedFollowing }));
  };

  useEffect(() => {
    const filtered = genre
      ? artists.filter(artist => artist.genres?.includes(genre))
      : artists;
    setDisplayArtists(filtered);
  }, [genre, artists]);

  useEffect(() => {
    const filtered = artists.filter(artist =>
      artist.username.toLowerCase().includes(search.toLowerCase())
    );
    setDisplayArtists(filtered);
  }, [search, artists]);

  return (
    <div className="discover-container graffiti">
      {/* Graffiti layering for visual splash */}
      <div className="paint-splatter"></div>
      <div className="paint-splatter layer2"></div>

      {/* Banner */}
      <div className="banner">
        <h1 className="company-name">Band4Band</h1>
      </div>

      {/* Profile Button */}
      <Link to="/profile">
        <img src={user?.profile_picture || profile} alt="Profile" className="profile-button" />
      </Link>

      {/* Nav Bar */}
      <nav className="nav-bar">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/discover">Discover</Link>
      </nav>

      {/* Main Discover Content */}
      <div className="discover-content">
        <h2 className="discover-title">Discover Artists</h2>

        <div className="filters">
          <input
            type="text"
            placeholder="Search artists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">All Genres</option>
            {genres.map((g, i) => (
              <option key={i} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="band-grid">
          {displayArtists.length ? (
            displayArtists.map((artist) => {
              if (artist.id === user.id) return null;
              return (
                <div key={artist.id} className="band-card">
                  <img src={artist.profile_picture || profile} alt={artist.username} />
                  <Link to={`/account?account=${encodeURIComponent(artist.id)}`}>
                    <h3>{artist.username}</h3>
                  </Link>
                  <p>{artist.genres?.join(", ")}</p>
                  <button onClick={() => follow(artist)}>
                    {user.following?.includes(artist.id) ? "Following" : "Follow"}
                  </button>
                </div>
              );
            })
          ) : (
            <p>No artists found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Discover;
