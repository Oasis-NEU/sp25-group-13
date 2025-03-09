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
      {/* Banner */}
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
        <Link to="/search">Search</Link>
      </div>

      {/* Calendar Content */}
      <div className="calendar-content">
        <h2 className="calendar-title">Calendar</h2>

        {/* React Calendar Component */}
        <ReactCalendar />
      </div>
    </div>
  );
}

export default Calendar;
