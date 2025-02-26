import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, login, verifyOtp } from '../actions/userActions';

const useSignIn = () => {
  const [staffNo, setStaffNo] = useState('');
  const [password, setPassword] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpRequired, setIsOtpRequired] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Extract state from Redux store
  const loginHandler = useSelector((state) => state.userLogin);
  const { userInfo, loading, error } = loginHandler;

  const verifyOtpHandler = useSelector((state) => state.otpVerify);
  const {
    userInfo: verifyOtpUserInfo,
    success: verifyOtpSuccess,
    error: verifyOtpError,
  } = verifyOtpHandler;

  const forgotPwdHandler = useSelector((state) => state.forgotPwd);
  const { success: forgotPwdSuccess, error: forgotPwdError } = forgotPwdHandler;

  // Handle login action
  const handleLogin = async () => {
    await dispatch(login(staffNo, password, branchCode));
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    await dispatch(verifyOtp(staffNo, otp, userInfo?.sessionToken, branchCode));

    console.log('verifyOtpUserInfo:', verifyOtpUserInfo);
    console.log('verifyOtpUserSuccess:', verifyOtpSuccess);
  };

  // Handle forgot password action
  const handleForgotPassword = async () => {
    await dispatch(forgotPassword(staffNo));
    if (forgotPwdSuccess) {
      navigate('/reset-password');
    }
  };

  // Monitor login state for OTP requirement
  useEffect(() => {
    if (userInfo?.sessionToken && !verifyOtpSuccess) {
      setIsOtpRequired(true); // OTP required after successful login
    } else {
      setIsOtpRequired(false);
    }
  }, [userInfo?.sessionToken, verifyOtpSuccess]);

  // After OTP verification, navigate based on user role
  useEffect(() => {
    if (verifyOtpUserInfo?.userData) {
      setOtp(''); // Clear OTP input
      setIsOtpRequired(false); // Hide OTP modal

      const role = verifyOtpUserInfo?.userData.departmentName;
      if (role === 'Reception') {
        navigate('/reception');
      } else if (role === 'Doctor') {
        navigate('/Doctor');
      } else if (role === 'LABORATORY') {
        navigate('/Lab');
      } else if (role === 'Security') {
        navigate('/Security');
      } else if (role === 'Nurse') {
        navigate('/Nurse');
      } else if (role === 'Psychology') {
        navigate('/Psychology');
      } else if (role === 'Radiology') {
        navigate('/Radiology');
      }
    }
  }, [verifyOtpSuccess, verifyOtpUserInfo, navigate]);

  return {
    staffNo,
    setStaffNo,
    password,
    setPassword,
    branchCode,
    setBranchCode,
    handleForgotPassword,
    otp,
    setOtp,
    isOtpRequired,
    setIsOtpRequired,
    handleLogin,
    handleVerifyOtp,
    loading,
    error,
    forgotPwdError,
    setIsOtpRequired,
  };
};

export default useSignIn;
