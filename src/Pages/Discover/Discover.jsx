import React, { useState, useEffect } from 'react';
import './Discover.css'; // Make sure your CSS file is in the right place
import { Link } from 'react-router-dom';

function Discover() {
  const [bands, setBands] = useState([]);

  // Example bands data or API call simulation
  useEffect(() => {
    // Simulating an API call or static data for now
    const fetchedBands = [
      { id: 1, name: "The Rockers", genre: "Rock", image: "path_to_image" },
      { id: 2, name: "Jazz Masters", genre: "Jazz", image: "path_to_image" },
      { id: 3, name: "Pop Legends", genre: "Pop", image: "path_to_image" },
    ];
    setBands(fetchedBands);
  }, []);

  return (
    <div>
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

      {/* Discover Page Content */}
      <div className="discover-content">
        <h1>Discover New Bands</h1>
        <div className="band-list">
          {bands.map(band => (
            <div key={band.id} className="band-item">
              <img src={band.image} alt={band.name} className="band-image" />
              <h3>{band.name}</h3>
              <p>Genre: {band.genre}</p>
              <Link to={`/band/${band.id}`} className="view-details">View Details</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Discover;
