import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-emerald-800">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Welcome back, <span className="font-semibold">{user?.name}</span>!
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/charities"
          className="rounded-xl border border-emerald-100 bg-white p-6 shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">Charities</h2>
          <p className="mt-1 text-sm text-gray-600">See charities and donate.</p>
        </Link>

        <Link
          to="/subscription"
          className="rounded-xl border border-emerald-100 bg-white p-6 shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">Subscription</h2>
          <p className="mt-1 text-sm text-gray-600">Manage your active plan and unlock draws.</p>
        </Link>

        <Link
          to="/profile"
          className="rounded-xl border border-emerald-100 bg-white p-6 shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="mt-1 text-sm text-gray-600">View and update your account details.</p>
        </Link>
      </div>

      <section className="mt-8 rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-emerald-700">Quick actions</h2>
        <p className="mt-2 text-gray-600">Access draws and score submission in the protected workflow below.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/draws" className="rounded-lg bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800 transition">
            Draw participation
          </Link>
          <Link to="/scores" className="rounded-lg bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800 transition">
            Score submission
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
