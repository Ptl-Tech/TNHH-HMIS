import OTP from "antd/es/input/OTP";
import { USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL, USER_LOGOUT, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, OTP_VERIFY_REQUEST, OTP_VERIFY_SUCCESS, OTP_VERIFY_FAIL, FORGOT_PWD_REQUEST, FORGOT_PWD_SUCCESS, FORGOT_PWD_FAIL, RESET_PWD_REQUEST, RESET_PWD_SUCCESS, RESET_PWD_FAIL } from "../constants/userConstants";

// User login reducer
// User Login Reducer
export const userLoginReducer = (state = { isLoggedIn: false, sessionToken: null }, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { ...state, loading: true };
    case USER_LOGIN_SUCCESS:
      return { loading: false, isLoggedIn: true, sessionToken: action.payload.sessionToken, userInfo: action.payload };
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return { isLoggedIn: false, sessionToken: null };
    default:
      return state;
  }
};

// OTP Verification Reducer
export const otpVerifyReducer = (state = { isVerified: false, portalSession: null, staffNo: null }, action) => {
  switch (action.type) {
    case OTP_VERIFY_REQUEST:
      return { ...state, loading: true };
    case OTP_VERIFY_SUCCESS:
      return { loading: false, isVerified: true, portalSession: action.payload.portalSession, staffNo: action.payload.staffNo, userInfo: action.payload };
    case OTP_VERIFY_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return { isVerified: false, portalSession: null, staffNo: null, userInfo: null };
    default:
      return state;
  }
};

  


  export const forgotPwdReducer = (state = {}, action) => {
    switch (action.type) {
      case FORGOT_PWD_REQUEST:
        return { loading: true };
      case FORGOT_PWD_SUCCESS:
        return { loading: false, success: true, userInfo: action.payload };
      case FORGOT_PWD_FAIL:
        return { loading: false, error: action.payload };       
      default:
        return state;
    }
  };
  
  export const resetPwdReducer = (state = { loading: false, success: false, error: null }, action) => {
    switch (action.type) {
      case RESET_PWD_REQUEST:
        return { ...state, loading: true }; // Retain previous state and update loading
      case RESET_PWD_SUCCESS:
        return { ...state, loading: false, success: true, error: null }; // Clear error on success
      case RESET_PWD_FAIL:
        return { ...state, loading: false, error: action.payload }; // Handle error state
      default:
        return state;
    }
  };
  

  // User registration reducer
  export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
      case USER_REGISTER_REQUEST:
        return { loading: true };
      case USER_REGISTER_SUCCESS:
        return { loading: false, userInfo: action.payload };
      case USER_REGISTER_FAIL:
        return { loading: false, error: action.payload };
      case USER_LOGOUT:
        return {}; // Clearing user data from state on logout
      default:
        return state;
    }
  };
  