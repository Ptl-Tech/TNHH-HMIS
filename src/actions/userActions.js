import axios from "axios";
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_RESET,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
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

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

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
    console.log("Dispatch USER_REGISTER_REQUEST");

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.post(`${API}auth/register`, userData, config);

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    message.success(data.message, 5);

    localStorage.setItem("userInfo", JSON.stringify(data)); // This persists the token

    return data.userId; // Return the user ID
  } catch (error) {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch({ type: USER_REGISTER_FAIL, payload: errorMessage });
    console.log("Dispatch USER_REGISTER_FAIL", errorMessage);

    message.error(error.response.data.message, 5);
  }
};
