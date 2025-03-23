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
    "Tech House", "Psytrance", "Indie Rock", "Post-punk", "Vaporwave"
  ];
  const { user } = useAuth();
  const navigate = useNavigate();
  const [aboutText, setAboutText] = useState("");
  const [image, setImage] = useState(null);
  const [table, setTable] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [currentGenre, setCurrentGenre] = useState("");

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

  // On mount: check login, set bio/genre/table
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user?.artist) {
      setTable("Artist Account");
    } else {
      setTable("ListenerAccount");
    }
    

    setAboutText(user?.bio ?? "Tell us about yourself...");
  setGenres(user?.genres);
  getEvents();
  
  }, [user, navigate]);

  // Update bio + genre
  const updateBio = async () => {
    if (aboutText) {
      setUploading(true);
      genres.push(currentGenre);
      console.log(genres)
      const { error } = await supabase
        .from(table)
        .upsert({ id: user?.id, bio: aboutText, genres: genres  });

      if (error) throw new Error(error.message);
      setUploading(false);
    }
  };

  //sets image to the uploaded file
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
     setImage(file);
    }
  }

//uploads file to database
  const uploadImage = async () => {
    if (image) {
      try {
        setUploading(true);
        const fileName = `${Date.now()}_${image.name}`;

        // Upload the image to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('profilepictures')
          .upload(fileName, image);

        if (uploadError) {
          console.error("upload error: ", uploadError.message)
          throw new Error(uploadError.message);
        }

        // Get the public URL of the uploaded image
        const { data: publicURLData, error: urlError } = supabase
          .storage
          .from('profilepictures')
          .getPublicUrl(fileName);

        if (urlError) {
          throw urlError;
        }

        const url = publicURLData.publicUrl;
        if (url) {
          setUploading(true);
          const { data, error } = await supabase
            .from(table)
            .upsert({ id: user?.id, profile_picture: url });
          if (error) {
            throw new Error(error.message);
          }
        }
        setUploading(false);
        
        alert('Upload successful!');
        setImage(null); 

      } catch (uploadError) {
        alert('Error uploading file: ' + uploadError.message);
      } finally {
        setUploading(false);
      }
     }
    };

  return (
    <div className="profile-container">
      {/* Banner */}
      <div className="banner">
        <h1 className="company-name">Band4Band</h1>
      </div>

      {/* Navigation Bar */}
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

      {/* Profile */}
      <div className="profile-content">
        <img className="profile-pic" src={user?.profile_picture} alt="Profile" />
        <input type="file" accept="image/*" onChange={handleUpload} />
        <button className="button" onClick={uploadImage} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>

        <h2 className="profile-username">{user?.username || "User Name"}</h2>

        <textarea
          className="about-textbox"
          value={aboutText}
          onChange={(e) => setAboutText(e.target.value)}
        />

        {/* Genre selection for artists */}
        {user?.artist && (
          <>
            <select
              className="about-textbox"
              value={currentGenre}
              onChange={(e) => setCurrentGenre(e.target.value)}
            >
              <option value="">Select Genre</option>
              <option value="Rock">Rock</option>
              <option value="Pop">Pop</option>
              <option value="Hip Hop">Hip Hop</option>
              <option value="Jazz">Jazz</option>
              <option value="Electronic">Electronic</option>
              <option value="Classical">Classical</option>
              <option value="Indie">Indie</option>
              <option value="Metal">Metal</option>
              <option value="Other">Other</option>
            </select>

            {!allGenres.includes(currentGenre) && (
              <input
                className="about-textbox"
                type="text"
                placeholder="Enter your genre"
                value={currentGenre}
                onChange={(e) => setCurrentGenre(e.target.value)}
              />
            )}
          </>
        )}

        <button className="button" onClick={updateBio}>Save</button>

        {/* Events */}
        <div className="events-section">
          {Array.isArray(events) && events.length > 0 ? (
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

