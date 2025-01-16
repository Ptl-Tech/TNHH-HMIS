import { message } from "antd";
import axios from "axios";

const API = "http://217.21.122.62:8085/";

// Action types
export const POST_MSE_NOTES_REQUEST = "POST_MSE_NOTES_REQUEST";
export const POST_MSE_NOTES_SUCCESS = "POST_MSE_NOTES_SUCCESS";
export const POST_MSE_NOTES_FAIL = "POST_MSE_NOTES_FAIL";
export const POST_MSE_NOTES_RESET = "POST_MSE_NOTES_RESET";

// Action creator for posting MSE notes
export const postMSENotes = (MSENotes) => async (dispatch, getState) => {
  try {
    // Dispatch the request action to indicate loading
    dispatch({ type: POST_MSE_NOTES_REQUEST });

    // Retrieve user information and branch code from state and localStorage
    const {
      otpVerify: { userInfo },
    } = getState();

    const branchCode = localStorage.getItem("branchCode");
    if (!branchCode) {
      throw new Error("Branch code is missing in localStorage");
    }

    if (!userInfo?.userData?.no || !userInfo?.userData?.portalSessionToken) {
      throw new Error("User information is incomplete");
    }

    // Request configuration
    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Staff number from user data
        sessionToken: userInfo.userData.portalSessionToken, // Session token
        branchCode, // Branch code from localStorage
      },
    };

    // Debug log for request payload
    console.log("MSE Notes Request Payload:", MSENotes);

    // Make the POST request to save MSE notes
    const response = await axios.post(`${API}PatientHistoryForm/SystemicReview`, MSENotes, config);

    if (response.status !== 200 || response.data.status !== "success") {
      throw new Error(response.data.message || "Failed to save MSE notes");
    }

    // Dispatch the success action with response data
    dispatch({
      type: POST_MSE_NOTES_SUCCESS,
      payload: response.data,
    });

    // Success notification
    // message.success("MSE notes saved successfully!");

    // Return success status
    return response.data.status;
  } catch (error) {
    // Error handling
    console.error("Error posting MSE Notes:", error);

    // Dispatch the failure action with a detailed error message
    dispatch({
      type: POST_MSE_NOTES_FAIL,
      payload: error.response?.data?.message || error.message,
    });

    // Error notification
    message.error(error.response?.data?.message || error.message);

    // Rethrow the error for further handling
    throw error;
  }
};
