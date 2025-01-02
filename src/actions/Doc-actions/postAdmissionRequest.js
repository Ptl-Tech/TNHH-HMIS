import axios from "axios";
import { message } from "antd"; // Ensure message is imported

const API = "http://217.21.122.62:8085/";

// Action Types
export const SAVE_ADMISSION_DETAILS_REQUEST = "SAVE_ADMISSION_DETAILS_REQUEST";
export const SAVE_ADMISSION_DETAILS_SUCCESS = "SAVE_ADMISSION_DETAILS_SUCCESS";
export const SAVE_ADMISSION_DETAILS_FAIL = "SAVE_ADMISSION_DETAILS_FAIL";


// Action Types
export const REQUEST_PATIENT_ADMISSION = "REQUEST_PATIENT_ADMISSION";
export const REQUEST_PATIENT_ADMISSION_SUCCESS = "REQUEST_PATIENT_ADMISSION_SUCCESS";
export const REQUEST_PATIENT_ADMISSION_FAIL = "REQUEST_PATIENT_ADMISSION_FAIL";


// Action to save admission details
export const saveAdmissionDetails = (Admission) => async (dispatch, getState) => {
  try {
    dispatch({ type: SAVE_ADMISSION_DETAILS_REQUEST });
    console.log("Admission Details:", Admission); // Corrected from Diagnosis
    // Get user info from state
    const {
      otpVerify: { userInfo },
    } = getState();

    // Get branch code from localStorage
    const branchCode = localStorage.getItem("branchCode");

    // Set headers for the request
    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Custom header: staffNo
        sessionToken: userInfo.userData.portalSessionToken, // Custom header: sessionToken
        branchCode: branchCode, // Custom header: branchCode
      },
    };

    console.log("Admission Request:", Admission); // Corrected from Diagnosis

    // Make API POST request
    const response = await axios.post(`${API}Doctor/PatientAdmission`, Admission, config);

    // Extract relevant data from response
    const responseData = {
      status: response.data.status,
      data: response.data, // Assuming the data contains the necessary response
    };

    // Simulate a delay for UI feedback
    setTimeout(() => {
      dispatch({ type: SAVE_ADMISSION_DETAILS_SUCCESS, payload: responseData });
      console.log("Dispatched Payload:", responseData);
    }, 2000);

    // Return patient ID for further use
    return responseData.data; // Assuming `msg` contains the patient ID

  } catch (error) {
    // Dispatch failure action with error message
    dispatch({
      type: SAVE_ADMISSION_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });

    // Show error message
    message.error(error.message, 5);

    // Rethrow error for further handling
    throw error;
  }
};




// Action to request patient admission
export const requestPatientAdmission = (treatmentId) => async (dispatch, getState) => {
  try {
    // Dispatch the request start action
    dispatch({ type: REQUEST_PATIENT_ADMISSION });

    // Get user info and branch code from state and local storage
    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem("branchCode");

    // Configure headers for the request
    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Custom header with staff number
        sessionToken: userInfo.userData.portalSessionToken, // Bearer token for session
        branchCode: branchCode, // Branch code from local storage
      },
    };

    // Corrected request body structure
    const response = await axios.post(
      `${API}Doctor/RequestPatientAdmission`, // Endpoint for requesting admission
      {
        treatmentNo: treatmentId, // Send treatmentNo as part of the request body
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
        type: REQUEST_PATIENT_ADMISSION_SUCCESS,
        payload: responseData,
      });
    }, 2000);

    // Return the patient ID for further use
    return responseData.data; // Assuming `data` contains the necessary info

  } catch (error) {
    // Dispatch failure action in case of error
    dispatch({
      type: REQUEST_PATIENT_ADMISSION_FAIL,
      payload: error.response?.data?.message || error.message, // Use response message if available
    });

    // Show error message
    message.error(error.message, 5);

    // Rethrow error for any additional handling
    throw error;
  }
};