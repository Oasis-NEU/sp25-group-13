import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: session } = await supabase.auth.getSession();
      const loggedInUser = session?.session?.user;

      if (loggedInUser) {
        // Fetch user row from Supabase database
        const { data, error } = await supabase
          .from("Listener Account") // Adjust table name if needed
          .select("*")
          .eq("id", loggedInUser.id) // Ensure this matches your Supabase user ID field
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
        } else {
          setUser(data); // Store user row in state
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
        setUser(session.user);
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