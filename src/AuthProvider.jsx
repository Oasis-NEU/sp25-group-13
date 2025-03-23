// AuthProvider.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabaseClient"; // Adjust the import based on your Supabase setup

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: session } = await supabase.auth.getSession();
      const loggedInUser = session?.session?.user;

      if (loggedInUser) {
        const table = loggedInUser.artist ? "Artist Account" : "ListenerAccount"
        // Fetch user row from Supabase database, assuming it matches id
        const { data, error } = await supabase
          .from(table)
          .select("id, contact, password, username, profile_picture, bio, artist, genres")
          .eq("id", loggedInUser.id)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
        } else {
          setUser({
            id: data.id,
            contact: data.contact,
            password: data.password,
            username: data.username,
            profile_picture: data.profile_picture,
            bio: data.bio,
            artist: data.artist,
            genres: data.genres
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser();
      } else {
        setUser(null);
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  // Context value
  const value = {
    user,
    setUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

// useAuth Hook
export const useAuth = () => {
  return useContext(AuthContext);
};

// Default export
export default AuthProvider;