// src/routes/AppRoutes.tsx
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Home from "../pages/Home";
import LandingPage from "../components/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import SubscriptionPage from "../pages/SubscriptionPage";
import Charities from "../pages/Charities";
import Draws from "../pages/Draws";
import Scores from "../pages/Scores";
import AdminPanel from "../pages/AdminPanel";
import MyWinnings from "../pages/MyWinnings";
import AdminWinners from "../pages/AdminWinners";
import PrivateRoute from "../components/common/PrivateRoute";
import AdminRoute from "../components/common/AdminRoute";

const AppRoutes: React.FC = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/dashboard" />}
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/subscription"
        element={
          <PrivateRoute>
            <SubscriptionPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/charities"
        element={
          <PrivateRoute>
            <Charities />
          </PrivateRoute>
        }
      />

      <Route
        path="/draws"
        element={
          <PrivateRoute>
            <Draws />
          </PrivateRoute>
        }
      />

      <Route
        path="/scores"
        element={
          <PrivateRoute>
            <Scores />
          </PrivateRoute>
        }
      />

      <Route
        path="/my-winnings"
        element={
          <PrivateRoute>
            <MyWinnings />
          </PrivateRoute>
        }
      />

      <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
      <Route path="/admin/winners" element={<AdminRoute><AdminWinners /></AdminRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;