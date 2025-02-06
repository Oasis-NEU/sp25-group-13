import './Search.css'
import { Link } from "react-router-dom";

function Search() {

  return (
    <div>
    {/* Navigation Links */}
    <div className="Links">
      <Link to="/home">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/search">Search</Link>
      <Link to="/calendar">Calendar</Link>
      <Link to="/discover">Discover</Link>
      <Link to="/account">Account</Link>
    </div>

    {/* Page Content */}
    <div className="Graphics">
      <h1>Search Page</h1>
    </div>
  </div>
  )
}

export default Search
