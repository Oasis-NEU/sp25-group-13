import './Calendar.css';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthProvider.jsx';
import Calendar from 'react-calendar';
import { useState } from 'react';
import { useEffect } from 'react';

function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user == null) {
      navigate("/login");
    }
  });
  return (
    <div className="calendar-container">
      {/* Navigation Links */}
      <div className="links">
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
        <p>Selected Date: {date.toDateString()}</p>
      </div>
    </div>
  );
}

export default CalendarPage;
