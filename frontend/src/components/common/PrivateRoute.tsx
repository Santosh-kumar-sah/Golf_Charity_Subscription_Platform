// src/components/common/PrivateRoute.tsx
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

interface Props {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!user)
    return (
      <Navigate
        to="/login"
        state={{ from: location, message: "Please login to continue" }}
        replace
      />
    );

  return <>{children}</>;
};

export default PrivateRoute;