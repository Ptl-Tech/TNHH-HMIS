import { useSelector } from 'react-redux';

// Custom hook to retrieve authenticated user info
const useAuth = () => {
  // Select the OTP verification state from Redux
  const userLogin = useSelector((state) => state.otpVerify);
  const { userInfo } = userLogin;


  // If userInfo is not found in Redux, check localStorage
  const storedUserInfo = localStorage.getItem('userInfo');
  if (storedUserInfo) {
    return JSON.parse(storedUserInfo);
  }

  return null; // Return null if no userInfo is found
};

export default useAuth;
