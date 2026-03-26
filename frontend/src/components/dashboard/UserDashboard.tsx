import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../common/Loader";

const UserDashboard: React.FC = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name}</h1>
      <p className="text-gray-700">Here is your dashboard overview.</p>
    </div>
  );
};

export default UserDashboard;