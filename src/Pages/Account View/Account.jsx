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

//gets events for this artist
const getEvents = async () => {
  try {
    let filteredEvents = [];
    console.log(account)
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

  //checks user is logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    getEvents();

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
        <Link to="/account">Account</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/discover">Discover</Link>
        <Link to="/login">Login</Link>
        <Link to="/profile">Profile</Link>
      </div>


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
      </div>
    </div>
  );

}
export default Account; 
