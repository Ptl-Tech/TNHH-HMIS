import {
  USER_FORGOT_PASSWORD_FAIL,
  USER_FORGOT_PASSWORD_REQUEST,
  USER_FORGOT_PASSWORD_SUCCESS,
} from "../../actions/auth-actions/forgot-password";
import {
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
} from "../../actions/auth-actions/reset-password";
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
} from "../../actions/auth-actions/login";
import {
  USER_LOGOUT_FAIL,
  USER_LOGOUT_REQUEST,
  USER_LOGOUT_SUCCESS,
} from "../../actions/auth-actions/logout";
import {
  VERIFY_OTP_FAIL,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
} from "../../actions/auth-actions/verify-otp";
import {
  GET_USER_DETAILS_FAIL,
  GET_USER_DETAILS_REQUEST,
  GET_USER_DETAILS_SUCCESS,
} from "../../actions/getUserDetails";

export const SHOW_OTP_MODAL = "SHOW_OTP_MODAL";
export const AUTH_RESET_MESSAGES = "AUTH_RESET_MESSAGES";

const initialState = {
  loading: false,
  OTPError: null,
  user: undefined,
  authError: null,
  loginError: null,
  OTPSuccess: null,
  userDetails: null,
  loginSuccess: null,
  staffNo: undefined,
  redirect: undefined,
  showOTPModal: false,
  resetPasswordError: null,
  forgotPasswordError: null,
  resetPasswordSuccess: null,
  forgotPasswordSuccess: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // These are supposed to handle the forgot password flow
    case USER_FORGOT_PASSWORD_REQUEST:
      return { ...state, loading: true };
    case USER_FORGOT_PASSWORD_FAIL:
      return { ...state, loading: false, forgotPasswordError: action.payload };
    case USER_FORGOT_PASSWORD_SUCCESS:
      const { staffNo, forgotPasswordSuccess } = action.payload;
      return {
        ...state,
        staffNo,
        loading: false,
        forgotPasswordSuccess,
        redirect: "/reset-password",
      };

    // These are supposed to handle the reset password flow
    case RESET_PASSWORD_REQUEST:
      return { ...state, loading: true };
    case RESET_PASSWORD_FAIL:
      return { ...state, loading: false, resetPasswordError: action.payload };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        staffNo: null,
        loading: false,
        redirect: "/login",
        resetPasswordSuccess: action.payload,
      };

    // These are supposed to handle the login flow
    case USER_LOGIN_REQUEST:
      return { ...state, loading: true };
    case USER_LOGIN_FAIL:
      return { ...state, loading: false, loginError: action.payload };
    case USER_LOGIN_SUCCESS:
      const { userDetails, loginSuccess } = action.payload;
      return {
        ...state,
        userDetails,
        loginSuccess,
        loading: false,
        showOTPModal: !userDetails.otpVerified,
      };

    // These are supposed to handle the logout flow
    case USER_LOGOUT_REQUEST:
      return { ...state, loading: true };
    case USER_LOGOUT_FAIL:
      return { ...state, loading: false, loginError: action.payload };
    case USER_LOGOUT_SUCCESS:
      return { ...state, user: null, loading: false };

    // These are supposed to handle the login flow
    case VERIFY_OTP_REQUEST:
      return { ...state, loading: true };
    case VERIFY_OTP_FAIL:
      return { ...state, loading: false, OTPError: action.payload };
    case VERIFY_OTP_SUCCESS:
      return {
        ...state,
        OTPSuccess,
        loading: false,
        userDetails: data,
        showOTPModal: !data.otpVerified,
      };

    // These are supposed to handle the login flow
    case GET_USER_DETAILS_REQUEST:
      return { ...state, loading: true };
    case GET_USER_DETAILS_FAIL:
      return {
        ...state,
        user: null,
        loading: false,
        authError: action.payload,
      };
    case GET_USER_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
      };

    //   Toggle the modal
    case SHOW_OTP_MODAL:
      return { ...state, showOTPModal: !state.showOTPModal };

    //  Resetting the messages
    case AUTH_RESET_MESSAGES:
      return {
        ...state,
        OTPError: null,
        redirect: null,
        authError: null,
        loginError: null,
        OTPSuccess: null,
        loginSuccess: null,
        resetPasswordError: null,
        forgotPasswordError: null,
        resetPasswordSuccess: null,
        forgotPasswordSuccess: null,
      };

    default:
      return state;
  }
};
