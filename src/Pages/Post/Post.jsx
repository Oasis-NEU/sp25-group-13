import './Post.css';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthProvider.jsx';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient.js';
import profile from '../../assets/emptyprofile.jpg';

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
    if (!user) {
      navigate("/login");
    } else {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("Post")
      .select("*")
      .eq("poster", user.id);

    if (error) {
      console.error("Error fetching posts: ", error.message);
    } else {
      setPosts(data);
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const uploadImage = async () => {
    if (!user || !image) return;

    try {
      setUploading(true);
      const fileName = `${user.id}/${Date.now()}_${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from('profilepictures')
        .upload(fileName, image);

      if (uploadError) throw uploadError;

      const { data: publicURLData } = supabase
        .storage
        .from('profilepictures')
        .getPublicUrl(fileName);

      const publicURL = publicURLData.publicUrl;
      setMedia((prev) => [...prev, publicURL]);
    } catch (err) {
      alert('Error uploading: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const post = async () => {
    try {
      const { data, error } = await supabase.from("Post").insert([{
        poster: user.id,
        bio,
        likes: 0,
        media,
        comments: []
      }]);

      if (error) throw error;

      setMessage("Post created!");
      setBio("Add a caption...");
      setMedia([]);
      fetchPosts();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
    navigate("/home");
  };

  return (
    <div className="discover-container">
      {/* Banner */}
      <div className="banner">
        <h1 className="company-name">Band4Band</h1>
      </div>

      {/* Profile Button */}
      <Link to="/profile">
        <img src={user?.profile_picture || profile} alt="Profile" className="profile-button" />
      </Link>

      {/* Navigation Bar */}
      <div className="nav-bar">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/discover">Discover</Link>
      </div>

      {/* Post Content */}
      <div className="discover-content">
        <h2 className="discover-title">Create a Post</h2>

        <div className="filters">
          <input type="file" className="imageInput" accept="image/*" onChange={handleUpload} />
          <button onClick={uploadImage} disabled={uploading || !image} className="button">
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>

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

        <button className="button" onClick={post}>Post</button>
        <div className="my-posts-section">
  <h2 className="my-posts-title">My Posts</h2>
  <div className="my-posts-grid">
    {posts.length === 0 ? (
      <p>No posts yet.</p>
    ) : (
      posts.map((post, index) => (
        <div key={index} className="post-card">
          <p>{post.bio}</p>
          {Array.isArray(post.media) && post.media.length > 0 ? (
  post.media.map((url, idx) => (
    <img key={idx} src={url} alt={`Post ${index} Img ${idx}`} className="post-image" />
  ))
) : (
  <p>No image uploaded.</p>
)}

          
          <input
            type="date"
            className="date-picker"
            value={post.date || ''}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              updatePostDate(post.id, e.target.value);
            }}
          />
        </div>
      ))
    )}
  </div>
</div>

      </div>
    </div>
  );
}

export default Post;
