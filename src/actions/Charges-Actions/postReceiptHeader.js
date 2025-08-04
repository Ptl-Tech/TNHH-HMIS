import { message } from "antd";
import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const POST_RECEIPT_HEADER_REQUEST = "POST_RECEIPT_HEADER_REQUEST";
export const POST_RECEIPT_HEADER_SUCCESS = "POST_RECEIPT_HEADER_SUCCESS";
export const POST_RECEIPT_HEADER_FAIL = "POST_RECEIPT_HEADER_FAIL";
export const POST_RECEIPT_HEADER_RESET = "POST_RECEIPT_HEADER_RESET";

export const postReceiptHeader = (receiptData) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_RECEIPT_HEADER_REQUEST });

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
      `${API}GeneralProcesses/ReceiptHeader`,
      receiptData,
      config
    );

    // Extract and validate the response data
    const { status, ReceiptNo } = response.data;
    if (status === "success" && ReceiptNo) {
      // Dispatch success action
      dispatch({
        type: POST_RECEIPT_HEADER_SUCCESS,
        payload: { status, ReceiptNo },
      });

      // Display success message
      // message.success(`Receipt Generated: ${ReceiptNo}`);

      // Return the receipt number 
      return ReceiptNo;
    } else {
      return status;
    }
  } catch (error) {
    // Dispatch failure action
    dispatch({
      type: POST_RECEIPT_HEADER_FAIL,
      payload: error.response?.data?.message || error.errors || error.message,
    });

    // Display error message
    message.error(error.response?.data?.message || "Failed to Post Receipt.");

    // Rethrow error for handling by other parts of the app
    throw error;
  }
};
