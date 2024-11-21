import React from 'react';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.otpVerify); // Access user info from Redux state
  const location = useLocation();

  // Redirect to login if the user is not authenticated
  if (!userInfo) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render the child routes if authenticated
  return <Outlet />;
};

export default PrivateRoute;
