import { createContext, useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import api from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    console.log("JWT:", token);

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/me")
      .then((res) => {
        console.log("ME RESPONSE:", res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.log("ME ERROR:", err.response?.status, err.message);
        if (err.response?.status === 401) {
          localStorage.removeItem("jwt");
          setUser(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("jwt", res.data.token);
    setUser(res.data.user);
    navigate("/dashboard");
  };

  const signup = async (email, password, name) => {
    const res = await api.post("/auth/signup", {
      name,
      email,
      password,
    });

    localStorage.setItem("jwt", res.data.token);
    setUser(res.data.user);
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setUser(null);
    navigate("/signin");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
