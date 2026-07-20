// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import api from "../services/api";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

// Backend mengembalikan role UPPERCASE (ADMIN/GURU/ORANGTUA).
// Frontend memakai key lowercase untuk routing (admin/guru/orangtua).
function normalizeUser(rawUser) {
  return {
    ...rawUser,
    role: rawUser.role.toLowerCase(),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  // Validasi sesi yang tersimpan saat pertama kali app dibuka
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => {
        const freshUser = normalizeUser(res.data.data);
        setUser(freshUser);
        localStorage.setItem("user", JSON.stringify(freshUser));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    const { token, user: rawUser } = res.data.data;

    const normalizedUser = normalizeUser(rawUser);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);

    return normalizedUser;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  const value = { user, loading, login, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
