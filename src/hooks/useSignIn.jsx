// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { forgotPassword, login, verifyOtp } from '../actions/userActions';
// const SESSION_TIMEOUT = 100 * 1000; // 10 seconds for testing (Change to 90 * 60 * 1000 for production)

// const useSignIn = () => {
//   const [staffNo, setStaffNo] = useState('');
//   const [password, setPassword] = useState('');
//   const [branchCode, setBranchCode] = useState('');
//   const [otp, setOtp] = useState('');
//   const [isOtpRequired, setIsOtpRequired] = useState(false);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Extract state from Redux store
//   const loginHandler = useSelector((state) => state.userLogin);
//   const { userInfo, loading, error } = loginHandler;

//   const verifyOtpHandler = useSelector((state) => state.otpVerify);
//   const {
//     userInfo: verifyOtpUserInfo,
//     success: verifyOtpSuccess,
//     error: verifyOtpError,
//   } = verifyOtpHandler;

//   const forgotPwdHandler = useSelector((state) => state.forgotPwd);
//   const { success: forgotPwdSuccess, error: forgotPwdError } = forgotPwdHandler;

//   // Handle login action
//   const handleLogin = async () => {
//     await dispatch(login(staffNo, password, branchCode));
//   };

//   // Handle OTP verification
//   const handleVerifyOtp = async () => {
//     await dispatch(verifyOtp(staffNo, otp, userInfo?.sessionToken, branchCode));
//   };

//   // Handle forgot password action
//   const handleForgotPassword = async () => {
//     await dispatch(forgotPassword(staffNo));
//     if (forgotPwdSuccess) {
//       navigate('/reset-password');
//     }
//   };

//   // Monitor login state for OTP requirement
//   useEffect(() => {
//     if (userInfo?.sessionToken && !verifyOtpSuccess) {
//       setIsOtpRequired(true); // OTP required after successful login
//     } else {
//       setIsOtpRequired(false);
//     }
//   }, [userInfo?.sessionToken, verifyOtpSuccess]);

//   // After OTP verification, navigate based on user role
//   useEffect(() => {
//     if (verifyOtpUserInfo?.userData) {
//       setOtp(''); // Clear OTP input
//       setIsOtpRequired(false); // Hide OTP modal

//       const role = verifyOtpUserInfo?.userData.departmentName;
//       if (role === 'Reception') {
//         navigate('/Reception');
//       } else if (role === 'Doctor') {
//         navigate('/Doctor');
//       } else if (role === 'Laboratory') {
//         navigate('/Lab');
//       } else if (role === 'Security') {
//         navigate('/Security');
//       } else if (role === 'Nurse') {
//         navigate('/Nurse');
//       } else if (role === 'Psychology') {
//         navigate('/Psychology');
//       } else if (role === 'Radiology') {
//         navigate('/Radiology');
//       } else if (role === 'Pharmacy') {
//         navigate('/Pharmacy');
//       }
//     }
//   }, [verifyOtpSuccess, verifyOtpUserInfo, navigate]);

//   // Store session start time in localStorage and set timeout
//   useEffect(() => {
//     if (userInfo?.sessionToken) {
//       const sessionStart = Date.now();
//       localStorage.setItem('sessionStart', sessionStart);

//       const timeout = setTimeout(() => {
//         localStorage.removeItem('sessionStart'); // Clear session from localStorage
//         navigate('/'); // Redirect to login
//       }, SESSION_TIMEOUT);

//       return () => clearTimeout(timeout); // Cleanup on unmount or logout
//     }
//   }, [userInfo, navigate]);

//   // Check if session expired on page reload
//   useEffect(() => {
//     const storedSessionStart = localStorage.getItem('sessionStart');
    
//     if (storedSessionStart) {
//       const elapsedTime = Date.now() - parseInt(storedSessionStart, 10);
//       if (elapsedTime >= SESSION_TIMEOUT) {
//         console.log('Session expired on reload. Redirecting to login...');
//         localStorage.removeItem('sessionStart'); // Clear storage
//         navigate('/');
//       } else {
//         const remainingTime = SESSION_TIMEOUT - elapsedTime;
//         console.log(
//           `Session resuming. Redirecting in ${remainingTime / 1000} seconds...`,
//         );

//         const timeout = setTimeout(() => {
//           console.log('Session expired. Logging out...');
//           localStorage.removeItem('sessionStart');
//           navigate('/');
//         }, remainingTime);

//         return () => clearTimeout(timeout);
//       }
//     }
//   }, [navigate]);
  
//   return {
//     staffNo,
//     setStaffNo,
//     password,
//     setPassword,
//     branchCode,
//     setBranchCode,
//     handleForgotPassword,
//     otp,
//     setOtp,
//     isOtpRequired,
//     setIsOtpRequired,
//     handleLogin,
//     handleVerifyOtp,
//     loading,
//     error,
//     forgotPwdError,
//     setIsOtpRequired,
//   };
// };

// export default useSignIn;