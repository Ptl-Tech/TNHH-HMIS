import axios from "axios";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  OTP_VERIFY_REQUEST,
  OTP_VERIFY_SUCCESS,
  OTP_VERIFY_FAIL,
  FORGOT_PWD_REQUEST,
  FORGOT_PWD_SUCCESS,
  FORGOT_PWD_FAIL,
  RESET_PWD_REQUEST,
  RESET_PWD_SUCCESS,
  RESET_PWD_FAIL,
} from "../constants/userConstants";
import { message } from "antd";

const API = "https://chiromo.potestastechnologies.net:8085/";

export const login = (staffNo, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    // API call
    const { data } = await axios.post(
      `${API}Authentication/Login`,
      { staffNo, password },
      config
    );

    // Dispatch success action
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    // Store user data in localStorage
    localStorage.setItem("userInfo", JSON.stringify(data));
    message.success(data.msg, 5);
  } catch (error) {
    console.log({ error });

    // Extract error message
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.errors ||
      "An unknown error occurred";


console.log("login error",error);

    // Dispatch failure action
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: errorMessage,
    });

    // Display error message using Ant Design's message component
    message.error(errorMessage);
  }
};


export const verifyOtp = (staffNo, otpCode, sessionToken, branchCode) => async (dispatch) => {
  try {
    dispatch({ type: OTP_VERIFY_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo,
        sessionToken,
        branchCode,
      },
    };


    const { data } = await axios.post(`${API}Authentication/OTPLogin`, { otpCode }, config);

    dispatch({ type: OTP_VERIFY_SUCCESS, payload: data });

    // Extract branch code from userInfo.userData
    const extractedBranchCode = data.userData?.shortcut_Dimension_1_Code || branchCode;

    // Save updated OTP state and user info to localStorage
    const otpState = {
      isVerified: true,
      portalSession: data.portalSession,
      staffNo: data.staffNo,
    };

      localStorage.setItem("otpVerifyState", JSON.stringify(otpState));
      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("branchCode", extractedBranchCode); // Save extracted branch code
    } catch (error) {
      dispatch({
        type: OTP_VERIFY_FAIL,
        payload: error.response?.data?.errors || error.errors,
      });
      message.error(error.response?.data?.errors || error.errors);
    }
  };

export const logout = () => (dispatch) => {
  try {
    // Clear user data from localStorage
    localStorage.removeItem("userInfo");
    localStorage.removeItem("branchCode");
    // Dispatch logout action to update state
    dispatch({ type: USER_LOGOUT });

  } catch (error) {
    message.error(error);
  }
};

//forgot password
export const forgotPassword = (staffNo) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PWD_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.post(
      `${API}Authentication/ForgotPassword`,
      { staffNo },
      config
    );

    console.log("response from the server", data);

    dispatch({ type: FORGOT_PWD_SUCCESS, payload: data });
  } catch (errors) {
    dispatch({
      type: FORGOT_PWD_FAIL,
      payload: errors.response?.data?.message || errors.message,
    });
  }
};

//reset password
export const resetPassword = (formData) => async (dispatch) => {
  try {
    dispatch({ type: RESET_PWD_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    // Rename the destructured variable to avoid conflict with the formData parameter
    const { data: responseData } = await axios.post(
      `${API}Authentication/ResetPassword`,
      formData, // Use 'formData' to pass the data
      config
    );

    // Dispatch the success action with the response data
    dispatch({ type: RESET_PWD_SUCCESS, payload: responseData });
  } catch (errors) {
    dispatch({
      type: RESET_PWD_FAIL,
      payload: errors.response?.data?.message || errors.message,
    });
  }
};

  export const register = (userData) => async (dispatch) => {
    try {
      dispatch({ type: USER_REGISTER_REQUEST });
      console.log('Dispatch USER_REGISTER_REQUEST');
  
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
  
      const { data } = await axios.post(`${API}auth/register`, userData, config);
  
      dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
      message.success(data.message, 5);
  
      localStorage.setItem('userInfo', JSON.stringify(data)); // This persists the token
  
      return data.userId; // Return the user ID
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;
  
      dispatch({ type: USER_REGISTER_FAIL, payload: errorMessage });
      console.log('Dispatch USER_REGISTER_FAIL', errorMessage);
  
      message.error(error.response.data.message, 5);
    }
  };
