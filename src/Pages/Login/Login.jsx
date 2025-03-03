import './Login.css'
import { Link, useNavigate  } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { supabase } from '../../supabaseClient';
import bcrypt from 'bcryptjs';

function Login() {
  const [activeComponent, setActiveComponent] = useState('');
  const [contact, setContact] = useState("");
  const [password, setPass] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // updates values on submit button press for listeners
  const handleCreate = async () => {
    //assigns the correct database table value to assign the account to
    const table = activeComponent === "create-listener" ? "Listener Account" : "Artist Account";
    setLoading(true);
    setMessage('');
    const hashedPassword = await bcrypt.hash(password, 10);

    // checks for repeat contact val
    const { data: contactRepeat, error: fetchErrorContact } = await supabase
      .from("Listener Account")
      .select("*")
      .eq("contact", contact)
      .single() || await supabase
      .from("Artist Account")
      .select("*")
      .eq("contact", contact);
    
    // checks for repeat username val
    const { data: usernameRepeat, error: fetchErrorUser } = await supabase
    .from("Listener Account")
    .select("*")
    .eq("username", username)
    .single() || await supabase
    .from("Artist Account")
    .select("*")
    .eq("username", username);

    // sign up for database if both terms unique, return error message if not
    if (fetchErrorContact && fetchErrorUser) {
        const { data, error } = await supabase
         .from(table)
         .insert([{ contact, username, password: hashedPassword }]);

        if (error) {
        setMessage(`Error: ${error.message}`);
        } else {
        setMessage("Account created successfully!");
        setContact("");
        navigate("/home");
        }
    } else if (!fetchErrorUser) {
      setMessage("Username is already taken.");
    } else {
      setMessage("This phone number/email is already registered.");
    }

    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');
    let data = null;
  
    //search listener for contact
    const { data: DataListener, error: ErrorListener } = await supabase
      .from("Listener Account")
      .select("id, contact, password") 
      .eq("contact", contact)
      .single();

    //checks if found
    if(!ErrorListener) {
      data = DataListener;
    } else {
      //search listener for contact
      const { data: DataArtist, error: ErrorArtist } = await supabase
        .from("Artist Account")
        .select("id, contact, password") 
        .eq("contact", contact)
        .single();
      
        //checks if found
        if(!ErrorArtist) {
          data = DataArtist
        } else {
          setMessage("Phone number/email not found.");
          setLoading(false);
          return;
        }
    }

      // Compare entered password with stored password (hashed)
      const isMatch = await bcrypt.compare(password, data.password);
      if (!isMatch) {
        setMessage("Incorrect password.");
        setLoading(false);
        return;
      }
  
    setMessage("Login successful!");
    navigate("/home");
    setLoading(false);
  };

  
  return (
    <div>
    {/* Navigation Links */}
    <div className="Links">
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
    <div className="Graphics">
      <h1>Login Page</h1>
    </div>
    <div className="login-container">

      <h1 className="login-header">Login or Create an Artist or Listener Account</h1>
        <div className="button-container"></div>
        <button onClick={() => setActiveComponent('login')}
        className="login-button">Login</button>
        <button onClick={() => setActiveComponent('create-listener')}
        className="login-button">Create Listener</button>
        <button onClick={() => setActiveComponent('create-artist')}
        className="login-button">Create Artist</button>
        
        {activeComponent === "login" && (
          <div className = "login">
            <h1>Login</h1>
            <input
              type="text"
              placeholder="Email or Phone Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPass(e.target.value)} />
            <button onClick={handleLogin} disabled={error != ""}>
                      {loading ? 'Logging you in...' : 'Login'}
            </button>
            {message && <p>{message}</p>}
          </div>
        )}

        {activeComponent === "create-listener" && (
          <div className = "listener-create">
            <h2>Create Listener</h2>
              <HandleContact contact={contact} setContact={setContact} setError={setError} />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPass(e.target.value)} />
              <button onClick={handleCreate} disabled={error != ""}>
                      {loading ? 'Creating...' : 'Create User'}
              </button>
              {message && <p>{message}</p>}
          </div>
        )}

        {activeComponent === "create-artist" && (
          <div className = "artist-create">
          <h2>Create Artist</h2>
            <HandleContact contact={contact} setContact={setContact} setError={setError} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPass(e.target.value)} />
            <button onClick={handleCreate} disabled={error != ""}>
                    {loading ? 'Creating...' : 'Create User'}
            </button>
            {message && <p>{message}</p>}
        </div>
        )}
      </div>
    </div>

  )
}

function HandleContact({contact, setContact, setError}) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Supports valid email addresses
  const phoneRegex = /^\d{10,15}$/; // Supports 10-15 digit numbers
  const [inputValue, setInputValue] = useState(contact);
  const contactVal = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (emailRegex.test(value) || phoneRegex.test(value)) {
      setError(""); // valid email address or phone number
      setContact(value);
    } else {
      setError("Invalid email or phone number"); // error
    }
  }

  return (
    <input
      type="text"
      placeholder="Email or Phone Number"
      value={inputValue}
      onChange={contactVal}
    />
  );
}

export default Login