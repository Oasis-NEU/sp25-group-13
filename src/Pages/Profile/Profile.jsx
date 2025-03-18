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

  //checks user is logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user?.artist) {
      setTable("Artist Account")
    } else {
      setTable("Listener Account")
    }
    if (user?.bio == null) {
      setAboutText("Tell us about yourself...")
    } else {
      setAboutText(user?.bio)
    }
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
      </div>
    </div>
  );
}

export default Profile;