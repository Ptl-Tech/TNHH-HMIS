import axios from "axios";
import { message } from "antd";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const POST_RECEIPT_REQUEST = "POST_RECEIPT_REQUEST";
export const POST_RECEIPT_SUCCESS = "POST_RECEIPT_SUCCESS";
export const POST_RECEIPT_FAIL = "POST_RECEIPT_FAIL";
export const POST_RECEIPT_RESET = "POST_RECEIPT_RESET";

export const postReceipt = (receipt) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_RECEIPT_REQUEST });

   
    const {
      auth: { user }
    } = getState();
    const branchCode = user.branchCode;

    // Set headers for the request
    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: user.staffNo,
        
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
    
     dispatch({
        type: POST_RECEIPT_SUCCESS,
        payload:response.data,
      });
          return response;

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
