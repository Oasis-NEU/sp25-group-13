import './Post.css'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthProvider.jsx';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function Post() {
  const { user } = useAuth();
  const [bio, setBio] = useState("Add a caption...");
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(null);
  const [media, setMedia] = useState([]);
  const [message, setMessage] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (user == null) {
      navigate("/login");
    }
  });

  //uploads file to database
    const uploadImage = async () => {
      if (image) {
        try {
          setUploading(true);
          const fileName = `${Date.now()}_${image.name}`;

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

          if (urlError) {
            throw urlError;
          }
          
          alert('Upload successful! Image URL: ' + publicURL);
  
        } catch (uploadError) {
          alert('Error uploading file: ' + uploadError.message);
        } finally {
          setUploading(false);
        }
       }
      };
  
//adds uploaded file to media
const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
     setImage(file);
    }
  }

  //uploads given info and redirects
  const post = async () => {
    const { data, error } = await supabase
            .from("Post")
            .insert([{
              poster: user.id, 
              bio: bio, 
              likes: 0, 
              media: media,
              comments: []}]);
    
            if (error) {
              setMessage(`Error: ${error.message}`);
            } else {
              setMessage("Posted successfully!");
              navigate("/home");
            }
            
  } 

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
    </div>

    {/* Page Content */}
    <div className="Graphics">
      <h1>Post Page</h1>
      <input type="file" className="imageInput" accept="image/*" onChange={handleUpload} src={"https://cdn-icons-png.flaticon.com/512/7187/7187487.png"}></input>
      <button className="button" id="upload-button" onClick={uploadImage} disabled={uploading} alt="Upload">{uploading ? 'Uploading...' : '+'}</button>
       {/* Editable Bio Section */}
       <textarea 
          className="bio-textbox"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <button className="button" id="post-button" onClick={post}>Post</button>
    </div>
  </div>
  )
}

export default Post