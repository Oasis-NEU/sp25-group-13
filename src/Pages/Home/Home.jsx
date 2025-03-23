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
  const plusSign = "https://cdn-icons-png.flaticon.com/512/7187/7187487.png"

  useEffect(() => {
    if (user == null) {
      navigate("/login");
    } else {
      fetchFeedPosts();
    }
  }, [user]);

  const fetchFeedPosts = async () => {
    try {
      //Gets the artists this user is following
      const { data: followingData, error: followingError } = await supabase
        .from('Followers')
        .select('followed_id')
        .eq('follower_id', user.id);

      if (followingError) {
        console.error("Error fetching following list:", followingError.message);
        return;
      }

      const followedArtistIds = followingData.map(follow => follow.followed_id);

      if (followedArtistIds.length === 0) {
        console.log("User is not following any artists yet.");
        setPosts([]);
        return;
      }

      //Gets posts from those followed artists
      const { data: postsData, error: postsError } = await supabase
        .from('Post')
        .select('*')
        .in('poster', followedArtistIds)
        .order('date', { ascending: false }); // Optional: show latest first

      if (postsError) {
        console.error("Error fetching posts:", postsError.message);
      } else {
        console.log("Fetched posts:", postsData);
        setPosts(postsData);
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
    }
  };

  return (
    <div className="home-container">
      {/* Banner Section */}
      <div className="banner">
        <h1 className="company-name">Band4Band</h1>
      </div>

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

      {/* Navigation Bar */}
      <nav className="nav-bar">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/account">Account</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/discover">Discover</Link>
        <Link to="/login">Login</Link>
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
