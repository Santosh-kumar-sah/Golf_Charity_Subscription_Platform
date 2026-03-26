// src/components/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logoutUser } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-extrabold tracking-wide">
            Golf Charity
          </Link>
          <span className="text-sm font-medium text-green-100">Play. Win. Give.</span>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          <Link to="/" className="hover:text-yellow-200 transition">
            Home
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-yellow-200 transition">
                Dashboard
              </Link>
              <Link to="/profile" className="hover:text-yellow-200 transition">
                Profile
              </Link>
              <Link to="/my-winnings" className="hover:text-yellow-200 transition">
                My Winnings
              </Link>
              <Link to="/subscription" className="hover:text-yellow-200 transition">
                Subscription
              </Link>
              {user.isAdmin && (
                <>
                  <Link to="/admin" className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition">
                    Admin Panel
                  </Link>
                  <Link to="/admin/winners" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition">
                    Winners
                  </Link>
                </>
              )}
              <button
                onClick={logoutUser}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-white text-green-700 px-3 py-1 rounded hover:bg-green-100 transition">
                Login
              </Link>
              <Link to="/register" className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300 transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;