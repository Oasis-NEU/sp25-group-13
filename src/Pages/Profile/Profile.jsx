import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthProvider.jsx';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import './Profile.css';


function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [aboutText, setAboutText] = useState("");
  const [image, setImage] = useState(null);
  const [table, setTable] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

//gets events for this artist
const getEvents = async () => {
  try {
    let filteredEvents = [];
    if (user.artist) {
      const { data, error } = await supabase
      .from("Event")
      .select('*')
      .order('artists', { ascending: true });

    if (error) throw error;
    console.log("Artist")
    console.log(data)
    filteredEvents = data.filter(event => {
      return event.artists.includes(user?.id); 
    });
    } else {
      const { data, error } = await supabase
      .from("Event")
      .select('*')
      .order('attending', { ascending: true });

    if (error) throw error;
    console.log("User: " + data)
    console.log(data)
    filteredEvents = data.filter(event => {
      return event.attending.includes(user?.id); 
    });
    }
    setEvents(filteredEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
  } finally {
    setLoading(false);
  }
};

  //checks user is logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user?.artist) {
      setTable("Artist Account")
    } else {
      setTable("ListenerAccount")
    }
    if (user?.bio == null) {
      setAboutText("Tell us about yourself...")
    } else {
      setAboutText(user?.bio)
    }
    setEvents(getEvents);

  }, [user, navigate]);

  

//updates bio when button is pressed
  const updateBio = async () => {
    if (aboutText) {
      setUploading(true);
      const { data, error } = await supabase
        .from(table)
        .upsert({ id: user?.id, bio: aboutText });
      if (error) {
        throw new Error(error.message);
      }
    }
    setUploading(false);
  }

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
      console.log(image)
      console.log(fileName)
        // Upload the image to Supabase Storage
        const { uploadData, uploadError } = await supabase.storage
          .from('profilepictures')
          .upload(fileName, image);

        if (uploadError) {
          console.error("upload error: ", uploadError.message)
          throw new Error(uploadError.message);
        }

        // Get the public URL of the uploaded image
        const { publicURL, error: urlError } = supabase
          .storage
          .from('profilepictures')
          .getPublicUrl(fileName);
      console.log(publicURL)
        if (urlError) {
          throw urlError;
        }

         // Update the user profile in the database with the new image URL
        const { error: dbError } = await supabase
          .from(table)
          .update({ profile_picture: publicURL })
          .eq('id', user.id); 

        if (dbError) {
          throw dbError;
        }
        
        alert('Upload successful! Image URL: ' + publicURL);
        setImage(null); // Clear the preview after upload

      } catch (uploadError) {
        alert('Error uploading file: ' + uploadError.message);
      } finally {
        setUploading(false);
      }
     }
    };

  return (
    <div className="profile-container">

      {/* Banner Section */}
      <div className="banner">
      <h1 className="company-name">Band4Band</h1>
    </div>

      {/* Navigation Links */}
      <div className="nav-bar">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/account">Account</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/discover">Discover</Link>
        <Link to="/login">Login</Link>
        <Link to="/profile">Profile</Link>
      </div>


      {/* Profile Content */}
      <div className="profile-content">
        <img className="profile-pic" src={user?.profile_picture} alt="Profile" />
        <input type="file" id="imageInput" accept="image/*" onChange={handleUpload}></input>
        <button className="button" onClick={uploadImage} disabled={uploading} alt="Upload">{uploading ? 'Uploading...' : 'Upload'}</button>
        <h2 className="profile-username">{user?.username || "User Name"}</h2>

        {/* Editable About Section */}
        <textarea 
          className="about-textbox"
          value={aboutText}
          onChange={(e) => setAboutText(e.target.value)}
        />
        <button className="button" onClick={updateBio}>Save</button>

        {/* events display */}
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
              <button>Invite Artists</button>
              <Link to={`/calendar?date=${encodeURIComponent(event.date)}`}>
                View Event
              </Link>
            </div>
          );
        })
          ) :  (
            <p>No events available.</p>
          )}
        </div>
      </div>
    </div>
  );

}
export default Profile; 
