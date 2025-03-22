import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabaseClient.js";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: session } = await supabase.auth.getSession();
      const loggedInUser = session?.session?.user;

      if (loggedInUser) {
        // Fetch user row from Supabase database, assuming it matches id
        const { data, error } = await supabase
          .from("ListenerAccount")
          .select("id, contact, password, username, profile_picture, bio, artist")
          .eq("id", loggedInUser.id)
          .single();
        // sets tags for each field for later reference
        if (error) {
          console.error("Error fetching user data:", error);
        } else {
          setUser(
            id = data.id,
            contact = data.contact,
            password = data.password,
            username = data.username,
            profile_picture = data.profile_picture,
            bio = data.bio,
            artist = data.artist
          );
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

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};


// Custom Hook to use Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;