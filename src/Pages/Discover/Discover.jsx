import './Discover.css';
import { Link } from 'react-router-dom';

function Discover() {
  // Example list of bands. In a real app, this could be fetched from a database.
  const bands = [
    {
      id: 1,
      name: 'The Electric Vibes',
      genre: 'Indie Rock',
      description: 'An indie rock band with a unique electric sound.',
      imageUrl: 'https://via.placeholder.com/250',
    },
    {
      id: 2,
      name: 'The Soul Rebels',
      genre: 'Jazz Fusion',
      description: 'A jazz fusion band blending smooth rhythms with wild improvisation.',
      imageUrl: 'https://via.placeholder.com/250',
    },
    {
      id: 3,
      name: 'Violet Skies',
      genre: 'Pop',
      description: 'A pop band with catchy tunes and vibrant energy.',
      imageUrl: 'https://via.placeholder.com/250',
    },
    {
      id: 4,
      name: 'Sunset Rhythms',
      genre: 'Reggae',
      description: 'A reggae band bringing warm, laid-back beats.',
      imageUrl: 'https://via.placeholder.com/250',
    },
  ];

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
      <div className="discover-container">
        <h1 className="discover-header">Discover New Bands</h1>

        <div className="band-list">
          {bands.map((band) => (
            <div key={band.id} className="band-card">
              <img src={band.imageUrl} alt={band.name} />
              <h2>{band.name}</h2>
              <p>{band.genre}</p>
              <p>{band.description}</p>
              <button>Follow Band</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Discover;
