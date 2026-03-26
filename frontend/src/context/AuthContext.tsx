
import React, { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import { type User, login, register, logout } from "../api/authApi";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (name: string, email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginUser: async () => {},
  registerUser: async () => {},
  logoutUser: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage token if exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const userData: User = await (await import("../api/authApi")).getMe();
        setUser(userData);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const loginUser = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      // Backend sets an httpOnly cookie; we can't read it here.
      // Keep localStorage only as a "logged in" flag for subsequent `getMe()` load.
      localStorage.setItem("token", "1");
      setUser(data.user);

      // Ensure we have the authoritative user shape from the backend.
      try {
        const userData: User = await (await import("../api/authApi")).getMe();
        setUser(userData);
      } catch {
        // Ignore getMe failures; we already set `data.user` from login response.
      }
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const data = await register({ name, email, password });
      localStorage.setItem("token", "1");
      setUser(data.user);

      // Same hardening as loginUser.
      try {
        const userData: User = await (await import("../api/authApi")).getMe();
        setUser(userData);
      } catch {
        // Ignore getMe failures; we already set `data.user` from register response.
      }
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    await logout();
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default useAuth;