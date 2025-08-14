import axios from "axios";
import { message } from "antd"; // Ensure message is imported

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

// Action Types
export const CANCEL_PATIENT_ADMISSION = "CANCEL_PATIENT_ADMISSION";
export const CANCEL_PATIENT_ADMISSION_SUCCESS = "CANCEL_PATIENT_ADMISSION_SUCCESS";
export const CANCEL_PATIENT_ADMISSION_FAIL = "CANCEL_PATIENT_ADMISSION_FAIL";
export const CANCEL_PATIENT_ADMISSION_RESET = "CANCEL_PATIENT_ADMISSION_RESET";



// Action to CANCEL patient admission
export const cancelPatientAdmission = (admissionNo) => async (dispatch, getState) => {
  try {
    // Dispatch the CANCEL start action
    dispatch({ type: CANCEL_PATIENT_ADMISSION });

    // Get user info and branch code from state and local storage
    const {
      auth: { user }
    } = getState();
    const branchCode = user.branchCode;

    // Configure headers for the VERIFY
    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: user.staffNo, // Custom header with staff number
         // Bearer token for session
        branchCode: branchCode, // Branch code from local storage
      },
    };

    // Corrected POST body structure
    const response = await axios.post(
      `${API}Admission/CancelAdmission   `, // Endpoint for POSTing admission
      {
        admissionNo: admissionNo, // Send treatmentNo as part of the POST body
      },
      config
    );

    // Extract response details
    const responseData = {
      status: response.data.status,
      data: response.data, // Assuming `data` contains the response data
    };

    // Dispatch success after a small delay
    setTimeout(() => {
      dispatch({
        type: CANCEL_PATIENT_ADMISSION_SUCCESS,
        payload: responseData,
      });
    }, 2000);

    // Return the patient ID for further use
    return responseData.data; 

  } catch (error) {
  
    setTimeout(() => {
      dispatch({
        type: CANCEL_PATIENT_ADMISSION_FAIL,
        payload: error.response?.data?.message|| error.errors,
      });
      message.error(error.response?.data?.errors || error.errors);
    }, 1200);

   
  

    // Rethrow error for any additional handling
    throw error;
  }
};