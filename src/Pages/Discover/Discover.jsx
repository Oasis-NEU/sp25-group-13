import './Discover.css';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthProvider.jsx';
import { useEffect, useState } from 'react';
import profile from '../../assets/emptyprofile.jpg'; // Reuse profile image from Home

function Discover() {
  // Sample data for bands
  const bands = [
    {
      id: 1,
      name: 'The Rockers',
      genre: 'Rock',
      rating: '4.5/5',
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 2,
      name: 'Jazz Fusion',
      genre: 'Jazz',
      rating: '4.2/5',
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 3,
      name: 'Pop Beats',
      genre: 'Pop',
      rating: '4.7/5',
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 4,
      name: 'Indie Vibes',
      genre: 'Indie',
      rating: '4.0/5',
      image: 'https://via.placeholder.com/200',
    },
  ];

  const { user } = useAuth();
  const navigate = useNavigate();

  // State to track the follow status of each band
  const [followedBands, setFollowedBands] = useState({});
  // State for search query and selected genre filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  useEffect(() => {
    if (user == null) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleFollow = (bandId) => {
    setFollowedBands((prevState) => ({
      ...prevState,
      [bandId]: !prevState[bandId], // Toggle follow status
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase()); // Update search query state
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value); // Update selected genre state
  };

  // Filter bands based on search query and genre selection
  const filteredBands = bands.filter((band) => {
    const matchesSearch = band.name.toLowerCase().includes(searchQuery);
    const matchesGenre = selectedGenre === 'all' || band.genre.toLowerCase() === selectedGenre.toLowerCase();
    return matchesSearch && matchesGenre;
  });

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
          <input 
            type="text" 
            placeholder="Search bands..." 
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <select onChange={handleGenreChange} value={selectedGenre}>
            <option value="all">All Genres</option>
            <option value="rock">Rock</option>
            <option value="jazz">Jazz</option>
            <option value="pop">Pop</option>
            <option value="indie">Indie</option>
          </select>
        </div>

        {/* Band Grid */}
        <div className="band-grid">
          {filteredBands.map((band) => (
            <div key={band.id} className="band-card">
              <Link to={`/band/${band.id}`} className="band-link">
                <img src={band.image} alt={band.name} />
                <h3>{band.name}</h3>
                <p>{band.genre}</p>
                <p>Rating: {band.rating}</p>
              </Link>
              <button
                onClick={() => handleFollow(band.id)}
                style={{
                  backgroundColor: followedBands[band.id] ? '#a8e9f0' : '#05445e',
                  borderColor: followedBands[band.id] ? '#a8e9f0' : '#05445e', // White border when followed
                  color: followedBands[band.id] ? '#05445e' : 'white', // Text color change
                }}
              >
                {followedBands[band.id] ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Discover;
