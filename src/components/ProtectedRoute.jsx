import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  
  console.log("ProtectedRoute - User:", user);
  console.log("ProtectedRoute - Token:", token);
  
  if (!user || !token) {
    console.log("No user or token found, redirecting to login");
    return <Navigate to="/" replace />;
  }

  console.log("User found:", user.role, "Allowed roles:", allowedRoles);

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log("Role not allowed, redirecting...");
    // Redirect based on role
    if (user.role === "admin") {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === "teacher") {
      return <Navigate to="/teacher/dashboard" replace />;
    } else if (user.role === "student") {
      return <Navigate to="/student/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  console.log("Access granted to:", user.role);
  return children;
};

export default ProtectedRoute;
