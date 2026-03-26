import React from "react";
import { useAuth } from "../context/AuthContext";

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-emerald-800">Profile</h1>
      <div className="mt-6 rounded-xl border border-emerald-100 bg-white p-6 shadow">
        <p className="text-lg font-semibold">Name: <span className="font-normal">{user?.name}</span></p>
        <p className="text-lg font-semibold mt-2">Email: <span className="font-normal">{user?.email}</span></p>
        <p className="text-lg font-semibold mt-2">Role: <span className="font-normal">{user?.isAdmin ? "Admin" : "Member"}</span></p>
      </div>
    </div>
  );
};

export default Profile;
