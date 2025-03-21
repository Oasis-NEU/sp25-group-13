import './Calendar.css';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthProvider.jsx';
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      console.log("✅ User loaded:", user);
      setLoading(true);
      getEvents();
    }
  }, [user, navigate, date]);

  const uploadEvent = async() => {
    const adjustedDate = new Date(eventDate).toISOString(); 
    const { data, error } = await supabase
      .from("Event")
      .insert([{ date: adjustedDate, artists: [user?.id], title: eventTitle }]);
  };

  const handleAddEvent = () => {
    if (!eventTitle.trim()) return;
    const newEvent = {
      id: Date.now(),
      date: date.toDateString(),
      title: eventTitle,
    };
    setEvents([...events, newEvent]);
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

  return (
    <div className="calendar-container">
      {/* Navigation Links */}
      <div className="nav-bar">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/account">Account</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/discover">Discover</Link>
        <Link to="/login">Login</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/search">Search</Link>
      </div>

      {/* Page Content */}
      <div className="calendar-content">
        <h1>Calendar Page</h1>
        <Calendar onChange={setDate} value={date} />
        <p>Selected Date: {date ? date.toDateString() : "No Date"}</p>

        {/* Temporary Bypass for Testing */}
        {user?.artist && (  // Force showing the button to test!
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
                <p>{event.location}</p>
                <p>{whenString}</p>
                <button>View Artists</button>
                <button>View Attending</button>
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

export default CalendarPage;
