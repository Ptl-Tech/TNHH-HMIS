import { message } from "antd";
import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

// Action types
export const POST_PATIENT_HISTORY_NOTES_REQUEST = "POST_PATIENT_HISTORY_NOTES_REQUEST";
export const POST_PATIENT_HISTORY_NOTES_SUCCESS = "POST_PATIENT_HISTORY_NOTES_SUCCESS";
export const POST_PATIENT_HISTORY_NOTES_FAIL = "POST_PATIENT_HISTORY_NOTES_FAIL";
export const POST_PATIENT_HISTORY_NOTES_RESET = "POST_PATIENT_HISTORY_NOTES_RESET";

// Action creator for posting patient history notes
export const postPatientHistoryNotes = (historyNotes) => async (dispatch, getState) => {
  try {
    // Dispatch the request action to indicate loading
    dispatch({ type: POST_PATIENT_HISTORY_NOTES_REQUEST });

    // Retrieve user information and branch code
    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem("branchCode");

    // Request configuration
    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Staff number from user data
        sessionToken: userInfo.userData.portalSessionToken, // Session token
        branchCode: branchCode, // Branch code from localStorage
      },
    };

    // Log the request payload for debugging
    console.log("Patient History Notes Request Payload:", historyNotes);

    // Make the POST request to save patient history notes
    const response = await axios.post(`${API}PatientHistoryForm/Notes`, historyNotes, config);

    // Extract response data
    const responseData = {
      status: response.data.status,
      data: response.data, // Assuming the response contains status and data
    };

    // Dispatch the success action with response data
    dispatch({ type: POST_PATIENT_HISTORY_NOTES_SUCCESS, payload: responseData });

    // Return relevant response data if needed
    return responseData.status;
  } catch (error) {
    // Log the error for debugging
    console.error("Error posting Patient History Notes:", error);

    // Dispatch the failure action with error message
    dispatch({
      type: POST_PATIENT_HISTORY_NOTES_FAIL,
      payload: error.response?.data?.message || error.errors || "Failed to save Patient History Notes.",
    });

    // Show error notification
    message.error(error.response?.data?.message || error.errors || "Failed to save Patient History Notes.");

    // Rethrow the error for further handling
    throw error;
  }
};
