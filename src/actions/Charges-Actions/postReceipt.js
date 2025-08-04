import axios from "axios";
import { message } from "antd";

const API = "https://chiromo.potestastechnologies.net:8091/";

export const POST_RECEIPT_REQUEST = "POST_RECEIPT_REQUEST";
export const POST_RECEIPT_SUCCESS = "POST_RECEIPT_SUCCESS";
export const POST_RECEIPT_FAIL = "POST_RECEIPT_FAIL";
export const POST_RECEIPT_RESET = "POST_RECEIPT_RESET";

export const postReceipt = (receipt) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_RECEIPT_REQUEST });

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
      `${API}GeneralProcesses/PostReceipt`,
      receipt,
      config
    );

    // Extract and validate the response data
    const { status } = response.data;
    if (status === "success" ) {
      // Dispatch success action
      dispatch({
        type: POST_RECEIPT_SUCCESS,
        payload: { status, },
      });

      // Display success message
      message.success(`Receipt Generated: ${status}`);

      // Return the receipt number 
      return status;
    } else {
      throw new Error("Invalid response format or missing ReceiptNo.");
    }
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";

    if (error.response) {
      // Extract validation errors properly
      const { data } = error.response;
      if (data.errors) {
        errorMessage = data.errors
      } else {
        errorMessage = data.title || error.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    dispatch({
      type: POST_RECEIPT_FAIL,
      payload: errorMessage,
    });

    message.error(errorMessage);

    throw error;
  }
};
