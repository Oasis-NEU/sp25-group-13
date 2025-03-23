
import './Login.css'
import { Link, useNavigate  } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { supabase } from '../../supabaseClient.js';

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
  const { setUser } = useAuth();

  const handleCreate = async () => {
    const table = activeComponent === "create-listener" ? "ListenerAccount" : "Artist Account";
    setLoading(true);
    setMessage('');
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: contactRepeat, error: fetchErrorContact } = await supabase
      .from(table)
      .select("id")
      .eq("contact", contact)
      .single();

    const { data: usernameRepeat, error: fetchErrorUser } = await supabase
      .from(table)
      .select("id")
      .eq("username", username)
      .single();

    if (!fetchErrorContact) {
      setMessage("This phone number/email is already registered.");
      setLoading(false);
      return;
    } else if (!fetchErrorUser) {
      setMessage("Username is already taken.");
      setLoading(false);
      return;
    } else {
      let insertData = {
        contact,
        username,
        password: hashedPassword,
        following: [],
        followers: [],
      };

      if (table === "Artist Account") {
        insertData = {
          ...insertData,
          profile_picture: "https://ycmiymyhtnehkjkyajqv.supabase.co/storage/v1/object/public/profilepictures//emptyprofile.jpg",
          bio: "",
          artist: true,
          genres: []
        };
      }

      const { data, error } = await supabase.from(table).insert([insertData]);

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage("Account created successfully!");
        setActiveComponent("login");
        setMessage("Please login")
        navigate("/login");
      }
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');
    let data = null;

    const { data: DataListener, error: ErrorListener } = await supabase
      .from("ListenerAccount")
      .select("id, contact, password, username, profile_picture, bio, artist, followers, following")
      .eq("contact", contact)
      .single();

    if (!ErrorListener) {
      data = DataListener;
    } else {
      const { data: DataArtist, error: ErrorArtist } = await supabase
        .from("Artist Account")
        .select("id, contact, password, username, profile_picture, bio, artist, followers, following, genres")
        .eq("contact", contact)
        .single();

      if (!ErrorArtist) {
        data = DataArtist;
      } else {
        setMessage("Phone number/email not found.");
        setLoading(false);
        return;
      }
    }

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
      following: data.following,
      genres: data.genres
    });
    navigate("/home");
    setLoading(false);
  };

  return (
    <div className="login-page">
      {/* Banner */}
      <div className="banner">
        <h1 className="company-name">Band4Band</h1>
      </div>

      {/* Tagline for extra sparkle */}
      <p className="login-tagline">“Your Front Row Seat to Local Music.”</p>

      {/* Main Login/Create Area */}
      <div className="login-container">
        <h1 className="login-header">Login or Create an Artist or Listener Account</h1>
        <div className="button-container">
          <button onClick={() => setActiveComponent('login')} className="login-button">Login</button>
          <button onClick={() => setActiveComponent('create-listener')} className="login-button">Create Listener</button>
          <button onClick={() => setActiveComponent('create-artist')} className="login-button">Create Artist</button>
        </div>

        {activeComponent === "login" && (
          <div className="login">
            <h2>Login</h2>
            <div className="login-form">
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
            <h2>Create Listener Account</h2>
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

      {/* Floating Charli-style sparkle */}
      <div className="emoji-glam">✨</div>
    </div>
  );
}

function HandleContact({ contact, setContact, setError }) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^\d{10,15}$/;
  const [inputValue, setInputValue] = useState(contact);

  const contactVal = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (emailRegex.test(value) || phoneRegex.test(value)) {
      setError("");
      setContact(value);
    } else {
      setError("Invalid email or phone number");
    }
  };

  return (
    <input
      type="text"
      placeholder="Email or Phone Number"
      value={inputValue}
      onChange={contactVal}
    />
  );
}

export default Login;
