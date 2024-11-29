import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ allowedRoles }) => {
  const { isLoggedIn, isVerified, userInfo } = useSelector((state) => ({
    isLoggedIn: state.userLogin?.isLoggedIn,
    isVerified: state.otpVerify?.isVerified,
    userInfo: JSON.parse(localStorage.getItem('userInfo')), // Assuming userInfo is stored in localStorage
  }));

  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isVerified) {
    return <Navigate to="/otp-verification" state={{ from: location }} replace />;
  }

  // Check if the user's departmentName matches allowedRoles
  if (
    allowedRoles &&
    (!userInfo || !allowedRoles.includes(userInfo.userData.departmentName))
  ) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
