import { message } from "antd";
import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const POST_RECEIPT_SPLIT_LINE_REQUEST = "POST_RECEIPT_SPLIT_LINE_REQUEST";
export const POST_RECEIPT_SPLIT_LINE_SUCCESS = "POST_RECEIPT_SPLIT_LINE_SUCCESS";
export const POST_RECEIPT_SPLIT_LINE_FAIL = "POST_RECEIPT_SPLIT_LINE_FAIL";
export const POST_RECEIPT_SPLIT_LINE_RESET = "POST_RECEIPT_SPLIT_LINE_RESET";

export const  postReceiptSplitLine = (data) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_RECEIPT_SPLIT_LINE_REQUEST });

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

    // Send patientNo as object, not string
   const splitData={
    ...data,
    staffNo: userInfo.userData.no,
    branchCode: branchCode,
   }

    // Make the POST request to the server
    const response = await axios.post(
      `${API}GeneralProcesses/ReceiptSplitLine`,
      splitData,
      config
    );

    // Extract and validate the response data
    const { status } = response.data;
    if (status === "success") {
      // Dispatch success action
      dispatch({
        type: POST_RECEIPT_SPLIT_LINE_SUCCESS,
        payload: { status },
      });
      // Display success message
      // message.success(`Receipt Split Lines posted: ${status}fully.`);

      // Return the CHARGES number
      return status;
    } else {
      throw new Error("Invalid response format or missing CHARGESNo.");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.errors || error.message || "An error occurred.";
    
    // Dispatch failure action
    dispatch({
      type: POST_RECEIPT_SPLIT_LINE_FAIL,
      payload: errorMessage,
    });

    // Display error message
    message.error(errorMessage);

    // Rethrow error for handling by other parts of the app
    throw error;
  }
};
