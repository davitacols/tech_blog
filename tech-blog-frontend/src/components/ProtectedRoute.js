// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute component to guard routes for authenticated users
function ProtectedRoute({ children }) {
  // Check for authentication - in this example, we look for an access token in localStorage
  const isAuthenticated = !!localStorage.getItem('access_token'); // Ensure a valid JWT token exists

  // Redirect to login if not authenticated
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
