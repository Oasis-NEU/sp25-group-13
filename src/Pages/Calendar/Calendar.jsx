import './Calendar.css';
import { Link } from "react-router-dom";
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import React Calendar styles

function Calendar() {
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
