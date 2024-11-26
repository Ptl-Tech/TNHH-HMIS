import React from 'react';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { isLoggedIn, isVerified } = useSelector((state) => ({
    isLoggedIn: state.userLogin?.isLoggedIn,
    isVerified: state.otpVerify?.isVerified,
  }));
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isVerified) {
    return <Navigate to="/otp-verification" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
