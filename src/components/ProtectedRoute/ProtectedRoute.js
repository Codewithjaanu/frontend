import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("token"); // Check if user exists in localStorage

  return isAuthenticated ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;
