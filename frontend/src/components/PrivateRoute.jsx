import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element }) => {
  const { author, loading } = useAuth();
  const location = useLocation();

  // Show a loading message while the authentication status is being checked
  if (loading) {
    return <div>Loading...</div>; 
  }

  // If authenticated, render the component
  if (author) {
    return element;
  }

  // Redirect to login page and preserve the current location
  return <Navigate to="/mainPage" state={{ from: location }} />;
};

export default PrivateRoute;
