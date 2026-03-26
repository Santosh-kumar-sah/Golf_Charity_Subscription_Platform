import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../common/Loader";

const AdminDashboard: React.FC = () => {
  const { loading } = useContext(AuthContext);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      <p className="text-gray-700">
        Manage users, subscriptions, scores, and charity draws here.
      </p>
    </div>
  );
};

export default AdminDashboard;