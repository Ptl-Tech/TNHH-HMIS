import { message } from "antd";
import axios from "axios";

const API = "http://217.21.122.62:8085/";

export const POST_CHARGES_REQUEST = "POST_CHARGES_REQUEST";
export const POST_CHARGES_SUCCESS = "POST_CHARGES_SUCCESS";
export const POST_CHARGES_FAIL = "POST_CHARGES_FAIL";
export const POST_CHARGES_RESET = "POST_CHARGES_RESET";

export const postPatientCharges = (charges) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_CHARGES_REQUEST });

    // Get user information and branch code from state and localStorage
    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem("branchCode");

    // Set headers for the request
    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no,
        sessionToken: userInfo.userData.portalSessionToken,
        branchCode: branchCode,
      },
    };

    // Make the POST request to the server
    const response = await axios.post(
      `${API}GeneralProcesses/PatientCharges`,
      charges,
      config
    );

    // Extract and validate the response data
    const { status } = response.data;
    if (status === "success" ) {
      // Dispatch success action
      dispatch({
        type: POST_CHARGES_SUCCESS,
        payload: { status, },
      });

      // Display success message
      message.success(`Patient Charges post: ${status}fully.`);

      // Return the CHARGES number 
      return status;
    } else {
      throw new Error("Invalid response format or missing CHARGESNo.");
    }
  } catch (error) {
    // Dispatch failure action
    dispatch({
      type: POST_CHARGES_FAIL,
      payload: error.response?.data?.message || error.errors || error.message,
    });

    // Display error message
    message.error(error.response?.data?.message || error.errors || "Failed to Post Charges.");

    // Rethrow error for handling by other parts of the app
    throw error;
  }
};
