import './Post.css';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthProvider.jsx';
import { useState, useEffect } from 'react';
import supabase from '/src/supabaseClient.js';

function Post() {
  const { user } = useAuth();
  const [bio, setBio] = useState("Add a caption...");
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(null);
  const [media, setMedia] = useState([]);
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching posts...");
    if (user == null) {
      navigate("/login");
    } else {
      fetchPosts();
    }
  }, [user, navigate]);
  
  const fetchPosts = async () => {
    console.log("Fetching posts for user:", user.id);
    const { data, error } = await supabase
      .from("Post")
      .select("*")
      .eq("poster", user.id);
  
    if (error) {
      console.error("Error fetching posts: ", error.message);
    } else {
      console.log("Posts fetched:", data);
      setPosts(data);
    }
  };
  const uploadImage = async () => {
    if (image) {
      try {
        setUploading(true);
        const fileName = `${user.id}/${Date.now()}_${image.name}`;

        const { error: uploadError } = await supabase.storage
          .from('profilepictures')
          .upload(fileName, image);

        if (uploadError) {
          console.error("upload error: ", uploadError.message);
          throw new Error(uploadError.message);
        }

        const { data: publicURLData, error: urlError } = supabase
          .storage
          .from('profilepictures')
          .getPublicUrl(fileName);

        if (urlError) {
          throw urlError;
        }

        const publicURL = publicURLData.publicUrl;

        setMedia((prev) => [...prev, publicURL]);

        alert('Upload successful!');

      } catch (err) {
        alert('Error uploading file: ' + err.message);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const post = async () => {
    const { data, error } = await supabase
      .from("Post")
      .insert([{
        poster: user.id,
        bio: bio,
        likes: 0,
        media: media,
        comments: [],
        date: selectedDate // Add date to the post
      }]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Posted successfully!");
      fetchPosts(); // Fetch posts again to update the list
    }
  };

  const handleDateChange = (date, postId) => {
    setSelectedDate(date);
    updatePostDate(postId, date);
  };

  const updatePostDate = async (postId, date) => {
    const { error } = await supabase
      .from("Post")
      .update({ date: date })
      .eq("id", postId);

    if (error) {
      console.error("Error updating post date: ", error.message);
    } else {
      fetchPosts(); // Fetch posts again to update the list
    }
  };

  return (
    <div>
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


      <div className="Graphics">
        <h1>Post Page</h1>
        <input type="file" className="imageInput" accept="image/*" onChange={handleUpload}></input>
        <button className="button" id="upload-button" onClick={uploadImage} disabled={uploading}>{uploading ? 'Uploading...' : '+'}</button>
        
        <div className="uploaded-images">
          {media.map((url, index) => (
            <img key={index} src={url} alt={`Uploaded ${index}`} className="uploaded-image" />
          ))}
        </div>


        <textarea 
          className="bio-textbox"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <button className="button" id="post-button" onClick={post}>Post</button>

        {/* Display Posts */}
        <div className="posts">
          {posts.map((post, index) => (
            <div key={index} className="post">
              <p>{post.bio}</p>
              {post.media.map((url, idx) => (
                <img key={idx} src={url} alt={`Post ${index} Image ${idx}`} className="post-image" />
              ))}
              <input 
                type="date" 
                className="date-picker" 
                value={post.date || ''} 
                onChange={(e) => handleDateChange(e.target.value, post.id)} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default Post

