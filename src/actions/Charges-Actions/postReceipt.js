import { message } from "antd";
import axios from "axios";

const API = "http://217.21.122.62:8085/";

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
    // Extract error response data
    const errorResponse = error.response?.data || {};
    const errorMessage = errorResponse.msg || "Failed to Process Receipt.";
    const errorStatus = errorResponse.status || "failed";

    // Dispatch failure action
    dispatch({
      type: POST_RECEIPT_FAIL,
      payload: { status: errorStatus, msg: errorMessage },
    });

    // Display error message
    message.error(`${errorStatus.toUpperCase()}: ${errorMessage}`);

    // Rethrow error for handling by other parts of the app
    throw error;
}

};
