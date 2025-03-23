import './Calendar.css';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../../AuthProvider.jsx';
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient.js';

function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [eventLocation, setEventLocation] = useState('');
  const [show, setShow] = useState(true);
  const [showType, setShowType] = useState('');
  const [eventDisplay, setEventDisplay] = useState([]);

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const dateParam = queryParams.get('date');
    if (dateParam) {
      setDate(new Date(dateParam));
    }
  }, [location]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      console.log("✅ User loaded:", user);
      setLoading(true);
      getEvents();
    }
  }, [user, navigate, date]);

  const uploadEvent = async () => {
    const adjustedDate = new Date(eventDate).toISOString();
    await supabase
      .from("Event")
      .insert([{ date: adjustedDate, artists: [user?.id], attending: [], title: eventTitle, location: eventLocation }]);
  };

  const handleAddEvent = () => {
    if (!eventTitle.trim()) return;
    setEventTitle('');
    setShowEventForm(false);
    uploadEvent();
  };

  const getEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("Event")
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      const filteredEvents = data.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === date.getDate();
      });
      setEvents(filteredEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchAttending = async (event) => {
    let newAttending = event.attending ? event.attending : [];
    if (event.attending.includes(user?.id)) {
      newAttending = event.attending.filter(item => item !== user.id);
    } else {
      newAttending = [...event.attending, user.id];
    }
    await supabase
      .from("Event")
      .upsert({ id: event?.id, attending: newAttending });

    setEvents(events.map((e) => e.id === event.id ? { ...e, attending: newAttending } : e));
  };

  const viewAttending = async (event) => {
    setShow(!show);
    setShowType("Attendees");
    setEventDisplay([]);
    if (show) {
      const attendees = event.attending;
      for (const current of attendees) {
        const { data: attendee } = await supabase
          .from("ListenerAccount")
          .select("id, profile_picture, username")
          .eq("id", current)
          .single();

        if (attendee && !eventDisplay.includes(attendee)) {
          setEventDisplay(prev => [...prev, attendee]);
        }
      }
    }
  };

  const viewPerforming = async (event) => {
    setShow(!show);
    setShowType("Artist");
    setEventDisplay([]);
    if (show) {
      const artists = event.artists;
      for (const current of artists) {
        const { data: artist } = await supabase
          .from("Artist Account")
          .select("id, profile_picture, username")
          .eq("id", current)
          .single();

        if (artist && !eventDisplay.includes(artist)) {
          setEventDisplay(prev => [...prev, artist]);
        }
      }
    }
  };

  return (
    <div className="calendar-container">
      <div className="paint-splatter"></div>
      <div className="paint-splatter layer2"></div>

       {/* Profile Button (Top Right) */}
       <Link to="/profile">
              <img src={user?.profile_picture || profile} alt="Profile" className="profile-button" />
            </Link>

      {/* Navigation */}
      <div className="banner">
        <h1 className="company-name">Band4Band</h1>
      </div>
      <div className="nav-bar">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/discover">Discover</Link>
      </div>

      {/* Calendar & Event Section */}
      <div className="calendar-content">
        <h1 className="calendar-title">Events on {date.toDateString()}</h1>
        <Calendar onChange={setDate} value={date} />

        {user?.artist && (
          <div className="add-event-container">
            <button className="add-event-button" onClick={() => setShowEventForm(!showEventForm)}>
              {showEventForm ? 'Cancel' : '➕ Add Event'}
            </button>
          </div>
        )}

        {showEventForm && (
          <div className="calendar-form">
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Event Title"
            />
            <input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
            <input
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="Event Location"
            />
            <button className="calendar-button" onClick={handleAddEvent}>Save Event</button>
          </div>
        )}

        {events.length > 0 ? (
          events.map((event) => {
            const eventDate = new Date(event.date);
            const whenString = eventDate.toLocaleString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
            });
            return (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <div className="locationContainer">
                  <img src="https://cdn-icons-png.flaticon.com/512/64/64113.png" alt="location" />
                  <p>{event.location}</p>
                </div>
                <p>{whenString}</p>
                <button onClick={() => viewPerforming(event)}>{showType === "Artist" && !show ? "Hide Artists" : "Show Artists"}</button>
                <button onClick={() => viewAttending(event)}>{showType === "Attendees" && !show ? "Hide Attendees" : "Show Attendees"}</button>
                {!user?.artist && (
                  <button onClick={() => switchAttending(event)}>{event.attending.includes(user.id) ? "Attending" : "Not Attending"}</button>
                )}
              </div>
            );
          })
        ) : (
          <p>No events available.</p>
        )}

        {!show && (
          <div>
            <h2>{showType === "Artist" ? "Performing" : "Attending"}</h2>
            {eventDisplay.length > 0 ? (
              eventDisplay.map((account) => (
                <div key={account.id} className="event-card">
                  <div className="profileContainer">
                    <img
                      src={account.profile_picture || "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"}
                      alt={account.username}
                    />
                    <Link to={`/account?account=${encodeURIComponent(account?.id)}&artist=${encodeURIComponent(account?.artist)}`}>
                      {account.username}
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p>No attendees yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarPage;
