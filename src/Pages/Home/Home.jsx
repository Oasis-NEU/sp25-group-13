import './Home.css'
import{BrowserRouter as Router, Routes, Route } from 'react-router-d'
import { Link } from "react-router-dom";
import About from "./Pages/About"
import Search from "./Pages/Search"
import Calendar from "./Pages/Calendar"
import Discover from "./Pages/Discover"
import Account from "./Pages/Account"

function Home() {

  return (
    <html>
        <head>
            <div class="Links">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/search">Search</Link>
                <Link to="/calendar">Calendar</Link>
                <Link to="/discover">Discover</Link>
                <Link to="/account">Account</Link>
            </div>
        </head>
        <body>
            <h1>Home</h1>
        </body>
    </html>
  )
}
export default Login