import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthProvider.jsx';
import { useEffect, useState } from 'react';
import { supabase } from "../../supabaseClient.js";
import './Profile.css';


function Profile() {
  const allGenres = [
    "Pop", "Rock", "Hip Hop", "Jazz", "Classical", "Electronic", "Reggae", 
    "Country", "Blues", "Soul", "R&B", "Metal", "Punk", "Folk", 
    "Alternative", "Indie", "Latin", "Disco", "Techno", "House", 
    "EDM", "Dubstep", "Trance", "Reggaeton", "Ska", "Gospel", 
    "Funk", "World", "Opera", "Ambient", "Trap", "K-pop", "Synthwave", 
    "Grunge", "New Wave", "Salsa", "Dancehall", "Progressive Rock", 
    "Hard Rock", "Gothic", "Electronica", "Ambient", "Bluegrass", 
    "Tech House", "Psytrance", "Indie Rock", "Post-punk", "Vaporwave", "Other"
  ];

  const { user } = useAuth();
  const navigate = useNavigate();

  const [aboutText, setAboutText] = useState("");
  const [image, setImage] = useState(null);
  const [table, setTable] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [genres, setGenres] = useState([]); // Final selected genres
  const [selectedGenre, setSelectedGenre] = useState(""); // Dropdown value
  const [customGenre, setCustomGenre] = useState(""); // If "Other" is selected


  // Get events for artist or listener
  const getEvents = async () => {
    try {
      let filteredEvents = [];
      if (user.artist) {
        const { data, error } = await supabase
          .from("Event")
          .select('*')
          .order('artists', { ascending: true });

        if (error) throw error;

        filteredEvents = data.filter(event => event.artists.includes(user?.id));
      } else {
        const { data, error } = await supabase
          .from("Event")
          .select('*')
          .order('attending', { ascending: true });

        if (error) throw error;

        filteredEvents = data.filter(event => event.attending.includes(user?.id));
      }

      setEvents(filteredEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // On mount
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setTable(user.artist ? "Artist Account" : "ListenerAccount");
    setAboutText(user?.bio ?? "Tell us about yourself...");
    setGenres(user?.genres || []);
    getEvents();
  }, [user, navigate]);

  // Handle bio and genres update
  const updateBio = async () => {
    if (!aboutText) return;

    setUploading(true);

    let updatedGenres = [...genres];

    // Add selected genre (dropdown) if valid and not duplicate
    if (selectedGenre && !updatedGenres.includes(selectedGenre) && selectedGenre !== "Other") {
      updatedGenres.push(selectedGenre);
    }

    // Add custom genre if provided and not duplicate
    if (customGenre && !updatedGenres.includes(customGenre)) {
      updatedGenres.push(customGenre);
    }

    try {
      const { error } = await supabase
        .from(table)
        .upsert({ id: user?.id, bio: aboutText, genres: updatedGenres });

      if (error) throw error;

      setGenres(updatedGenres);
      setSelectedGenre("");
      setCustomGenre("");
      alert("Profile updated!");
    } catch (error) {
      console.error("Error updating bio/genres:", error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const uploadImage = async () => {
    if (!image) return;

    try {
      setUploading(true);

      const fileName = `${Date.now()}_${image.name}`;
      const { error: uploadError } = await supabase.storage
        .from('profilepictures')
        .upload(fileName, image);

      if (uploadError) throw uploadError;

      const { data: publicURLData, error: urlError } = supabase
        .storage
        .from('profilepictures')
        .getPublicUrl(fileName);

      if (urlError) throw urlError;

      const url = publicURLData.publicUrl;

      const { error } = await supabase
        .from(table)
        .upsert({ id: user?.id, profile_picture: url });

      if (error) throw error;

      alert('Upload successful!');
      setImage(null);
    } catch (error) {
      alert('Error uploading file: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  //handles upload of pfp
  const profileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Use FileReader to display the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set the image data in state
      };
    }
    setUser({
      profile_picture: reader.readAsDataURL(file)
    });
  };

  return (
    <div className="profile-container">
      <div className="banner">
        <h1 className="company-name">Band4Band</h1>
      </div>

      <div className="nav-bar">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/discover">Discover</Link>
        <Link to="/profile">Profile</Link>
      </div>

      <div className="profile-content">
        <img
          className="profile-pic"
          src={user?.profile_picture || "https://via.placeholder.com/150"}
          alt="Profile"
        />

        <input type="file" accept="image/*" onChange={handleUpload} />
        <button className="button" onClick={uploadImage} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Image"}
        </button>

        <h2 className="profile-username">{user?.username || "User Name"}</h2>

        <textarea
          className="about-textbox"
          value={aboutText}
          onChange={(e) => setAboutText(e.target.value)}
          placeholder="Tell us about yourself..."
        />

        {user?.artist && (
          <>
            {/* Genre Selection */}
            <select
              className="about-textbox"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="">Select Genre</option>
              {allGenres.map((genre, index) => (
                <option key={index} value={genre}>
                  {genre}
                </option>
              ))}
            </select>

            {/* Custom Genre Input */}
            {selectedGenre === "Other" && (
              <input
                className="about-textbox"
                type="text"
                placeholder="Enter your custom genre"
                value={customGenre}
                onChange={(e) => setCustomGenre(e.target.value)}
              />
            )}

            {/* Genres Display */}
            <div className="genres-section">
              <h3>Genres:</h3>
              {genres.length > 0 ? (
                <ul className="genres-list">
                  {genres.map((genre, index) => (
                    <li key={index}>{genre}</li>
                  ))}
                </ul>
              ) : (
                <p>No genres selected yet.</p>
              )}
            </div>
          </>
        )}

        <button className="button" onClick={updateBio} disabled={uploading}>
          {uploading ? "Saving..." : "Save Profile"}
        </button>

        {/* Events */}
        <div className="events-section">
          <h3>Your Events</h3>
          {loading ? (
            <p>Loading events...</p>
          ) : events.length > 0 ? (
            events.map((event) => {
              const eventDate = new Date(event.date);
              const whenString = eventDate.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });
              return (
                <div key={event.id} className="event-card">
                  <h3>{event.title}</h3>
                  <p>{event.location}</p>
                  <p>{whenString}</p>
                  <Link to={`/calendar?date=${encodeURIComponent(event.date)}`}>
                    View Event
                  </Link>
                </div>
              );
            })
          ) : (
            <p>No events available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
