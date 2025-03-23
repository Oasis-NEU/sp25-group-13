import './Calendar.css';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../../AuthProvider.jsx';
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient.js';
import profile from "../../assets/emptyprofile.jpg";  // Import default profile image

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
      setLoading(true);
      getEvents();
    }
  }, [user, navigate, date]);

  const uploadEvent = async () => {
    const adjustedDate = new Date(eventDate).toISOString();
    const { data, error } = await supabase
      .from("Event")
      .insert([{ date: adjustedDate, artists: [user?.id], attending: [], title: eventTitle, location: eventLocation }]);
  };

  const handleAddEvent = () => {
    if (!eventTitle.trim()) return;
    const newEvent = {
      id: Date.now(),
      date: date.toDateString(),
      title: eventTitle,
    };
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
        const eventDateString = eventDate.getDate();
        return eventDateString === date.getDate();
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
      newAttending = [...event.attending, user.id]
    }
    const { data, error } = await supabase
      .from("Event")
      .upsert({ id: event?.id, attending: newAttending });
    setEvents(events.map((e) =>
      e.id === event.id ? { ...e, attending: newAttending } : e
    ));
  };

  const viewAttending = async (event) => {
    setShow(!show);
    setShowType("Attendees");
    setEventDisplay([]);
    if (show) {
      let attendees = event.attending;

      if (Array.isArray(attendees) && attendees.length > 0) {
        for (const current of attendees) {
          try {
            const { data: attendee, error: attendeeError } = await supabase
              .from("ListenerAccount")
              .select("id, profile_picture, username")
              .eq("id", current)
              .single();

            if (attendeeError) {
              console.error("Error fetching attendee:", attendeeError);
              continue;
            }

            if (attendee && !eventDisplay.includes(attendee)) {
              setEventDisplay([...eventDisplay, attendee]);
            }
          } catch (err) {
            console.error("Error fetching attendee:", err);
          }
        }
      }
    }
  };

  const viewPerforming = async (event) => {
    setShow(!show);
    setShowType("Artist");
    setEventDisplay([]);
    if (show) {
      let artists = event.artists;

      if (Array.isArray(artists) && artists.length > 0) {
        for (const current of artists) {
          try {
            const { data: artist, error: artistError } = await supabase
              .from("Artist Account")
              .select("id, profile_picture, username")
              .eq("id", current)
              .single();

            if (artistError) {
              console.error("Error fetching artist:", artistError);
              continue;
            }

            if (artist && !eventDisplay.includes(artist)) {
              setEventDisplay([...eventDisplay, artist]);
            }
          } catch (err) {
            console.error("Error fetching artist:", err);
          }
        }
      }
    }
  };

  return (
    <div className="calendar-container">
      {/* Banner Section */}
      <div className="banner">
        <h1 className="company-name">Band4Band</h1>
      </div>

      {/* Profile Button (Top Right) */}
      <Link to="/profile">
        <img src={user?.profile_picture || profile} alt="Profile" className="profile-button" />
      </Link>

      {/* Navigation Bar */}
      <nav className="nav-bar">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/discover">Discover</Link>
      </nav>

      {/* Page Content */}
      <div className="calendar-content">
        <h1>Calendar Page</h1>
        <Calendar onChange={setDate} value={date} />

        {user?.artist && (
          <button onClick={() => setShowEventForm(!showEventForm)}>
            {showEventForm ? 'Cancel' : 'Add Event'}
          </button>
        )}

        {/* Event Form */}
        {showEventForm && (
          <div style={{ marginTop: '15px' }}>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Enter Event Title"
              style={{
                padding: '8px',
                marginRight: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc'
              }}
            />
            <input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              placeholder="Enter Event Time"
              style={{
                padding: '8px',
                marginRight: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc'
              }}
            />
            <input
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="Enter Event Location"
              style={{
                padding: '8px',
                marginRight: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc'
              }}
            />
            <button onClick={handleAddEvent} style={{
              padding: '8px 12px',
              borderRadius: '5px',
              backgroundColor: '#189ab4',
              color: 'white',
              border: 'none'
            }}>
              Save Event
            </button>
          </div>
        )}

        {/* Events Display */}
        <div style={{ marginTop: '20px' }}>
          <h2>Events on {date.toDateString()}</h2>
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
                  <div className="locationContainer">
                    <img src="https://cdn-icons-png.flaticon.com/512/64/64113.png" alt="Location" />
                    <p>{event.location}</p>
                  </div>
                  <p>{whenString}</p>
                  <button onClick={() => viewPerforming(event)}>{showType === "Artist" && !show ? "Hide Artists" : "Show Artists"}</button>
                  <button onClick={() => viewAttending(event)}>{showType === "Attendees" && !show ? "Hide Attendees" : "Show Attendees"}</button>
                  {!user?.artist &&
                    <button onClick={() => switchAttending(event)}>{event.attending.includes(user.id) ? "Attending" : "Not Attending"}</button>}
                </div>
              );
            })
          ) : (
            <p>No events available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
