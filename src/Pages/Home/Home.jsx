import './Home.css'
import{BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Link } from "react-router-dom";
import About from "../About/About.jsx";
import Search from "../Search/Search.jsx";
import Calendar from "../Calendar/Calendar.jsx";
import Discover from "../Discover/Discover.jsx";
import Account from "../Account View/Account.jsx";

function Home() {

  return (
    <div>
    <div className="Links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/search">Search</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/discover">Discover</Link>
        <Link to="/account">Account</Link>
    </div>

    <div className="Graphics">
        <h1>Home</h1>
    </div>
    </div>
  )
}
export default Home