import { message } from "antd";
import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const POST_GENERATE_INVOICE_REQUEST = "POST_GENERATE_INVOICE_REQUEST";
export const POST_GENERATE_INVOICE_SUCCESS = "POST_GENERATE_INVOICE_SUCCESS";
export const POST_GENERATE_INVOICE_FAIL = "POST_GENERATE_INVOICE_FAIL";
export const POST_GENERATE_INVOICE_RESET = "POST_GENERATE_INVOICE_RESET";

export const postGenerateInvoice = (patientNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_GENERATE_INVOICE_REQUEST });

   
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

    // Send patientNo as object, not string

    // Make the POST request to the server
    const response = await axios.post(
      `${API}GeneralProcesses/GeneratePatientInsuranceReport`,
      patientNo,
      config
    );

    // Extract and validate the response data
    const { status } = response.data;
    dispatch({
      type: POST_GENERATE_INVOICE_SUCCESS,
      payload: { status },
    });
    return status;
  } catch (error) {
    const errorMessage = error.response?.data?.errors || error.message || "An error occurred.";
    
    // Dispatch failure action
    dispatch({
      type: POST_GENERATE_INVOICE_FAIL,
      payload: errorMessage,
    });

    // Display error message
    message.error(errorMessage);

    // Rethrow error for handling by other parts of the app
    throw error;
  }
};
