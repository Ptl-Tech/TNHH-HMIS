import { message } from "antd";
import axios from "axios";

const API = "http://217.21.122.62:8085/";

export const POST_GENERATE_INVOICE_REQUEST = "POST_GENERATE_INVOICE_REQUEST";
export const POST_GENERATE_INVOICE_SUCCESS = "POST_GENERATE_INVOICE_SUCCESS";
export const POST_GENERATE_INVOICE_FAIL = "POST_GENERATE_INVOICE_FAIL";
export const POST_GENERATE_INVOICE_RESET = "POST_GENERATE_INVOICE_RESET";

export const postGenerateInvoice = (patientNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_GENERATE_INVOICE_REQUEST });

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

//send patientNo as object not string
    patientNo = {patientNo: patientNo};

    // Make the POST request to the server
    const response = await axios.post(
      `${API}GeneralProcesses/GeneratePatientInsuranceReport`,
      patientNo,
      config
    );

    // Extract and validate the response data
    const { status } = response.data;
    if (status === "success" ) {
      // Dispatch success action
      dispatch({
        type: POST_GENERATE_INVOICE_SUCCESS,
        payload: { status, },
      });

      // Display success message
      message.success(`Invoice generated: ${status}fully.`);

      // Return the CHARGES number 
      return status;
    } else {
      throw new Error("Invalid response format or missing CHARGESNo.");
    }
  } catch (error) {
    // Dispatch failure action
    dispatch({
      type: POST_GENERATE_INVOICE_FAIL,
      payload: error.response?.data?.message || error.errors,
    });

    // Display error message
message.error(error.response?.data?.message || error.errors || "An error occurred.");

    // Rethrow error for handling by other parts of the app
    throw error;
  }
};
