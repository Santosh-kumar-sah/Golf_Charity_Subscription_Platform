// // src/context/AuthContext.tsx
// import React, { createContext, useState, useEffect,type ReactNode } from "react";
// import { type User, getMe, login, register,logout } from "../api/authApi";

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   loginUser: (email: string, password: string) => Promise<void>;
//   registerUser: (name: string, email: string, password: string) => Promise<void>;
//   logoutUser: () => Promise<void>;
// }

// export const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   loginUser: async () => {},
//   registerUser: async () => {},
//   logoutUser: async () => {},
// });

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Load user on app start
//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const currentUser = await getMe();
//         setUser(currentUser);
//       } catch (err) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadUser();
//   }, []);

//   const loginUser = async (email: string, password: string) => {
//     const data = await login({ email, password });
//     localStorage.setItem("token", data.token);
//     setUser(data.user);
//   };

//   const registerUser = async (name: string, email: string, password: string) => {
//     const data = await register({ name, email, password });
//     localStorage.setItem("token", data.token);
//     setUser(data.user);
//   };

//   const logoutUser = async () => {
//     await logout();
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, loginUser, registerUser, logoutUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// src/context/AuthContext.tsx
// import React, { createContext, useState, useEffect, useContext, type ReactNode } from "react";
// import { type User, getMe, login, register, logout } from "../api/authApi";

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   loginUser: (email: string, password: string) => Promise<void>;
//   registerUser: (name: string, email: string, password: string) => Promise<void>;
//   logoutUser: () => Promise<void>;
// }

// export const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   loginUser: async () => {},
//   registerUser: async () => {},
//   logoutUser: async () => {},
// });

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Load user on app start
//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const currentUser = await getMe();
//         setUser(currentUser);
//       } catch (err) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadUser();
//   }, []);

//   const loginUser = async (email: string, password: string) => {
//     const data = await login({ email, password });
//     localStorage.setItem("token", data.token);
//     setUser(data.user);
//   };

//   const registerUser = async (name: string, email: string, password: string) => {
//     const data = await register({ name, email, password });
//     localStorage.setItem("token", data.token);
//     setUser(data.user);
//   };

//   const logoutUser = async () => {
//     await logout();
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, loginUser, registerUser, logoutUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // ✅ Custom hook for easier access to AuthContext
// const useAuth = () => useContext(AuthContext);

// export default useAuth;

// src/context/AuthContext.tsx
// import React, { createContext, useState, useEffect, useContext, type ReactNode } from "react";
// import { type User, getMe, login, register, logout } from "../api/authApi";
// import { getMySubscription, type Subscription } from "../api/subscriptionApi";

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   loginUser: (email: string, password: string) => Promise<void>;
//   registerUser: (name: string, email: string, password: string) => Promise<void>;
//   logoutUser: () => Promise<void>;
//   refreshUser: () => Promise<void>;
// }

// export const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   loginUser: async () => {},
//   registerUser: async () => {},
//   logoutUser: async () => {},
//   refreshUser: async () => {},
// });

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   const loadUser = async () => {
//     setLoading(true);
//     try {
//       const currentUser = await getMe();

//       // Try fetching subscription, ignore error if none exists
//       try {
//         const subscription: Subscription = await getMySubscription();
//         currentUser.subscription = subscription;
//       } catch {
//         currentUser.subscription = undefined;
//       }

//       setUser(currentUser);
//     } catch {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadUser();
//   }, []);

//   const loginUser = async (email: string, password: string) => {
//     const data = await login({ email, password });
//     localStorage.setItem("token", data.token);

//     // Fetch subscription
//     try {
//       const subscription = await getMySubscription();
//       data.user.subscription = subscription;
//     } catch {
//       data.user.subscription = undefined;
//     }

//     setUser(data.user);
//   };

//   const registerUser = async (name: string, email: string, password: string) => {
//     const data = await register({ name, email, password });
//     localStorage.setItem("token", data.token);

//     // Fetch subscription
//     try {
//       const subscription = await getMySubscription();
//       data.user.subscription = subscription;
//     } catch {
//       data.user.subscription = undefined;
//     }

//     setUser(data.user);
//   };

//   const logoutUser = async () => {
//     await logout();
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, loginUser, registerUser, logoutUser, refreshUser: loadUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // ✅ Custom hook for easier access
// const useAuth = () => useContext(AuthContext);

// export default useAuth;


// src/context/AuthContext.tsx
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