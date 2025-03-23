import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../../AuthProvider.jsx';
import { useEffect, useState } from 'react';
import { supabase } from "../../supabaseClient.js";
import './Account.css';



function Account() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [aboutText, setAboutText] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false)
  const [account, setAccount] = useState();
  const [posts, setPosts] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const getAcct = async() => {
      const queryParams = new URLSearchParams(location.search);
      const acctParam = queryParams.get('account');
      if (acctParam) {
        const {data, error} = await supabase
        .from("Artist Account")
        .select("*")
        .eq("id", acctParam)
        .single();
        setAccount(data);
      }
    }
    getAcct();

  }, [location]);

  useEffect(() => {
    getEvents();
    getPosts();
  }, [account])

//gets events for this artist
const getEvents = async () => {
  try {
    console.log(account)
    let filteredEvents = [];
    if (account?.artist) {
      const { data, error } = await supabase
      .from("Event")
      .select('*')
      .order('artists', { ascending: true });

    if (error) throw error;
    filteredEvents = data.filter(event => {
      return event.artists.includes(account?.id); 
    });

    } else {
      const { data, error } = await supabase
      .from("Event")
      .select('*')
      .order('attending', { ascending: true });

    if (error) throw error;
    filteredEvents = data.filter(event => {
      return event.attending.includes(account?.id); 
    });
    }
    setEvents(filteredEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
  } finally {
    setLoading(false);
  }
};

const getPosts = async () => {
  try {
    let filteredPosts = [];
      const { data, error } = await supabase
        .from("Post")
        .select('*')
        .order('poster', { ascending: true });

      if (error) throw error;

      filteredPosts = data.filter(post => post.poster == account?.id);
      setPosts(filteredPosts);
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
    }

  }, [user, navigate]);

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
        <Link to="/calendar">Calendar</Link>
        <Link to="/discover">Discover</Link>
      </div>

      <Link to="/profile">
        <img src={user?.profile_picture} alt="Profile" className="profile-button" />
      </Link>

      {/* Profile Content */}
      <div className="profile-content">
        <img className="profile-pic" src={account?.profile_picture} alt="Profile" />
        <h2 className="profile-username">{account?.username || "User Name"}</h2>

        {/* Editable About Section */}
        <p className="about-textbox">
          {account?.bio}
        </p>

        {/* events display */}
        <div className="events-section">
          <script>
            getEvents();
          </script>
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
          ) :  (
            <p>No events available.</p>
          )}
        </div>
        {/* Genres Display */}
        <div className="genres-section">
              <h3>Genres:</h3>
              {account?.genres.length > 0 ? (
                <ul className="genres-list">
                  {account?.genres.map((genre, index) => (
                    <li key={index}>{genre}</li>
                  ))}
                </ul>
              ) : (
                <p>No genres selected yet.</p>
              )}
            </div>
      </div>

      {/* Posts */}
      <div className="feed">
        <h2>Posts</h2>
        <div className="post-container">
          {posts.length === 0 ? (
            <p>No posts yet!.</p>
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
export default Account; 
