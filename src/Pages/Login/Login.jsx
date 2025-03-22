import './Login.css'
import { Link, useNavigate  } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import supabase from '/src/supabaseClient.js';
import bcrypt from 'bcryptjs';
import { useAuth } from '../../AuthProvider.jsx';

function Login() {
  const [activeComponent, setActiveComponent] = useState('');
  const [contact, setContact] = useState("");
  const [password, setPass] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const {setUser} = useAuth();

  // updates values on submit button press for listeners
  const handleCreate = async () => {
    //assigns the correct database table value to assign the account to
    const table = activeComponent === "create-listener" ? "ListenerAccount" : "Artist Account";
    setLoading(true);
    setMessage('');
    const hashedPassword = await bcrypt.hash(password, 10);

    // checks for repeat contact val
    const { data: contactRepeat, error: fetchErrorContact } = await supabase
      .from(table)
      .select("id")
      .eq("contact", contact)
      .single() 
    
    // checks for repeat username val
    const { data: usernameRepeat, error: fetchErrorUser } = await supabase
    .from(table)
    .select("id")
    .eq("username", username)
    .single()

    // sign up for database if both terms unique, return error message if not
    if (!fetchErrorContact) {
      setMessage("This phone number/email is already registered.");
      setLoading(false);
      return;
    } else if (!fetchErrorUser) {
      setMessage("Username is already taken.");
      setLoading(false);
      return;
    } else {
      const { data, error } = await supabase
        .from(table)
        .insert([{ contact, 
          username, 
          password: hashedPassword, 
          following: [],
          followers: [],
        }]);

        if (error) {
          setMessage(`Error: ${error.message}`);
        } else {
          setMessage("Account created successfully!");
          setUser({
            id: data.id,
            contact: data.contact,
            username: data.username,
            profile_picture: data.profile_picture,
            
          });
          setActiveComponent('login');
        }
    } 
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');
    let data = null;
    //search listener for contact
    const { data: DataListener, error: ErrorListener } = await supabase

      .from("ListenerAccount")

      .select("id, contact, password, username, profile_picture, bio, artist, followers, following") 

      .eq("contact", contact)
      .single();

    //checks if found
    if(!ErrorListener) {
      data = DataListener;
    } else {
      //search artist for contact
      const { data: DataArtist, error: ErrorArtist } = await supabase
        .from("Artist Account")
        .select("id, contact, password, username, profile_picture, bio, artist, followers, following") 
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
    setUser({
      id: data.id,
      contact: data.contact,
      username: data.username,
      password: data.password,
      profile_picture: data.profile_picture,
      bio: data.bio,
      artist: data.artist,
      followers: data.followers,
      following: data.following
    });
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
    </div>

    {/* Page Content */}
    <div className="Graphics">
      <h1>Login Page</h1>
    </div>
    <div className="login-container">

      <h1 className="login-header">Login or Create an Artist or ListenerAccount</h1>
        <div className="button-container"></div>
        <button onClick={() => setActiveComponent('login')}
        className="login-button">Login</button>
        <button onClick={() => setActiveComponent('create-listener')}
        className="login-button">Create Listener</button>
        <button onClick={() => setActiveComponent('create-artist')}
        className="login-button">Create Artist</button>
        
        {activeComponent === "login" && (
          <div className="login">
          <h1>Login</h1>
          <div className="login-form">  {/* This wrapper ensures centering */}
            <input
              type="text"
              placeholder="Email or Phone Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPass(e.target.value.toString())}
            />
            <button onClick={handleLogin} disabled={error !== ""}>
              {loading ? "Logging you in..." : "Login"}
            </button>
            {message && <p>{message}</p>}
          </div>
        </div>
        
        )}

{activeComponent === "create-listener" && (
  <div className="create-container">
    <h2>Create ListenerAccount</h2>
    <div className="create-form">
      <HandleContact contact={contact} setContact={setContact} setError={setError} />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPass(e.target.value)}
      />
      <button onClick={handleCreate} disabled={error !== ""}>
        {loading ? "Creating..." : "Create Account"}
      </button>
      {message && <p>{message}</p>}
    </div>
  </div>
)}

{activeComponent === "create-artist" && (
  <div className="create-container">
    <h2>Create Artist Account</h2>
    <div className="create-form">
      <HandleContact contact={contact} setContact={setContact} setError={setError} />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPass(e.target.value)}
      />
      <button onClick={handleCreate} disabled={error !== ""}>
        {loading ? "Creating..." : "Create Account"}
      </button>
      {message && <p>{message}</p>}
    </div>
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