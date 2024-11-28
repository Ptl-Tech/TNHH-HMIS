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

  const loginHandler = useSelector((state) => state.userLogin);
  const { userInfo } = loginHandler;

  const verifyOtpHandler = useSelector((state) => state.otpVerify);
  const {userInfo: verifyOtpUserInfo, success: verifyOtpSuccess } = verifyOtpHandler;


  const forgotPwdHandler = useSelector((state) => state.forgotPwd);
  const { userInfo: forgotPwdUserInfo, success: forgotPwdSuccess , error: forgotPwdError } = loginHandler;

  const handleLogin = async () => {
    await dispatch(login(staffNo, password, branchCode));
    console.log("User info:", userInfo);
    if (userInfo?.sessionToken) {
      setIsOtpRequired(true); // Show OTP modal when sessionToken exists
    }
  };

  const handleVerifyOtp = async () => {
    console.log('Verifying OTP with:', staffNo, otp, userInfo?.sessionToken, userInfo?.branchCode);
    await dispatch(verifyOtp(staffNo, otp, userInfo?.sessionToken, branchCode?.branchCode)); // Pass branchCode here
  
    if (verifyOtpUserInfo) {
      setOtp('');
      setIsOtpRequired(false);
      navigate("/Nurse/Dashboard"); // Navigate to the next page after OTP verification
    }
  };
  


  const handleForgotPassword = async () => {
    await dispatch(forgotPassword(staffNo ));
    console.log("User info:", userInfo);
     
    if(forgotPwdSuccess) {
      navigate("/reset-password");
    }
  };

  // Effect to handle OTP modal visibility based on sessionToken
  useEffect(() => {
    if (userInfo?.sessionToken  && !verifyOtpSuccess) {
      setIsOtpRequired(true); // Show OTP modal if sessionToken exists and OTP is not verified
    } else {
      setIsOtpRequired(false); // Close OTP modal after OTP verification
    }
  }, [userInfo?.sessionToken, verifyOtpSuccess]);
  
  useEffect(() => {
    if (verifyOtpUserInfo) {
      // Reset OTP state before navigating
      setOtp('');
      setIsOtpRequired(false);
      // Navigate to Doctor route after successful OTP verification
      navigate("/Nurse/Dashboard");
    }
  }, [verifyOtpUserInfo]);

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
    handleLogin,
    handleVerifyOtp,
    loading: loginHandler.loading,
    error: loginHandler.error,
  };
};

export default useSignIn;
