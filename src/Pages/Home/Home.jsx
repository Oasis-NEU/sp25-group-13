import './Home.css';
import { Link, useNavigate } from "react-router-dom";
import profile from "../../assets/emptyprofile.jpg";
import { useAuth } from '../../AuthProvider.jsx';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient.js';

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const plusSign = "https://cdn-icons-png.flaticon.com/512/7187/7187487.png";

  useEffect(() => {
    if (user == null) {
      navigate("/login");
    } else {
      fetchFeedPosts();
    }
  }, [user]);

  const fetchFeedPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('Post')
        .select('*')
        .in('poster', user?.following)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error("Error fetching posts:", postsError.message);
      } else {
        setPosts(postsData);
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
    }
  };

  return (
    <div className="home-container">
      {/* Post Button (Top Left) - Only visible for artists */}
      {user?.artist && (
        <Link to="/post">
          <img src={plusSign} alt="Post" className="post-button" />
        </Link>
      )}

      {/* Profile Button (Top Right) */}
      <Link to="/profile">
        <img src={user?.profile_picture || profile} alt="Profile" className="profile-button" />
      </Link>

      {/* Banner Section */}
      <div className="banner">
        <h1 className="company-name">Band4Band</h1>
      </div>

      {/* Navigation Bar */}
      <nav className="nav-bar">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/discover">Discover</Link>
      </nav>

      {/* Home Feed */}
      <div className="feed">
        <h2>Your Feed</h2>
        <div className="post-container">
          {posts.length === 0 ? (
            <p>No posts yet! Follow artists to see their posts here.</p>
          ) : (
            posts.map((post, index) => (
              <div key={index} className="post">
                <p>{post.bio}</p>
                {post.media && post.media.map((url, idx) => (
                  <img key={idx} src={url} alt={`Post ${index} Image ${idx}`} style={{ width: "100%", borderRadius: "10px" }} />
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
