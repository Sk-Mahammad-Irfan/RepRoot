import { useContext, useEffect, useState, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });
  useEffect(() => {
    try {
      const data = localStorage.getItem("auth");
      if (data) {
        const parsed = JSON.parse(data);
        setAuth({
          user: parsed.user,
          token: parsed.token,
        });
      }
    } catch (err) {
      console.error("Failed to parse auth from localStorage:", err);
      localStorage.removeItem("auth"); // Clean it up
    }
  }, []);

  // Update axios headers when token changes
  useEffect(() => {
    if (auth?.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth?.token]);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
