import axios from "axios";
import { message } from "antd"; // Ensure message is imported

const API = "http://217.21.122.62:8085/";

// Action Types
export const VERIFY_PATIENT_ADMISSION = "VERIFY_PATIENT_ADMISSION";
export const VERIFY_PATIENT_ADMISSION_SUCCESS = "VERIFY_PATIENT_ADMISSION_SUCCESS";
export const VERIFY_PATIENT_ADMISSION_FAIL = "VERIFY_PATIENT_ADMISSION_FAIL";
export const VERIFY_PATIENT_ADMISSION_RESET = "VERIFY_PATIENT_ADMISSION_RESET";



// Action to VERIFY patient admission
export const verifyPatientAdmission = (admissionNo) => async (dispatch, getState) => {
  try {
    // Dispatch the VERIFY start action
    dispatch({ type: VERIFY_PATIENT_ADMISSION });

    // Get user info and branch code from state and local storage
    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem("branchCode");

    // Configure headers for the VERIFY
    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Custom header with staff number
        sessionToken: userInfo.userData.portalSessionToken, // Bearer token for session
        branchCode: branchCode, // Branch code from local storage
      },
    };

    // Corrected POST body structure
    const response = await axios.post(
      `${API}Admission/VerifyAdmission  `, // Endpoint for POSTing admission
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
        type: VERIFY_PATIENT_ADMISSION_SUCCESS,
        payload: responseData,
      });
    }, 2000);

    // Return the patient ID for further use
    return responseData.data; 

  } catch (error) {
  
    setTimeout(() => {
      dispatch({
        type: VERIFY_PATIENT_ADMISSION_FAIL,
        payload: error.response?.data?.message|| error.errors,
      });
      message.error(error.response?.data?.errors || error.errors);
    }, 1200);

   
  

    // Rethrow error for any additional handling
    throw error;
  }
};