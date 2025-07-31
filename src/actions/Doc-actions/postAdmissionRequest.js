import axios from "axios";
import { message } from "antd"; // Ensure message is imported

const API = "https://chiromo.potestastechnologies.net:8091/";

// Action Types
export const SAVE_ADMISSION_DETAILS_REQUEST = "SAVE_ADMISSION_DETAILS_REQUEST";
export const SAVE_ADMISSION_DETAILS_SUCCESS = "SAVE_ADMISSION_DETAILS_SUCCESS";
export const SAVE_ADMISSION_DETAILS_FAIL = "SAVE_ADMISSION_DETAILS_FAIL";


// Action Types
export const REQUEST_PATIENT_ADMISSION = "REQUEST_PATIENT_ADMISSION";
export const REQUEST_PATIENT_ADMISSION_SUCCESS = "REQUEST_PATIENT_ADMISSION_SUCCESS";
export const REQUEST_PATIENT_ADMISSION_FAIL = "REQUEST_PATIENT_ADMISSION_FAIL";


export const saveAdmissionDetails = (Admission) => async (dispatch, getState) => {
  try {
    dispatch({ type: SAVE_ADMISSION_DETAILS_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();

    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no,
        sessionToken: userInfo.userData.portalSessionToken,
        branchCode: branchCode,
      },
    };

    const admissionData = {
      ...Admission,
      staffNo: userInfo.userData.no,
    };

    const response = await axios.post(`${API}Doctor/PatientAdmission`, admissionData, config);

    const responseData = {
      status: response.data.status,
      data: response.data,
    };

    setTimeout(() => {
      dispatch({ type: SAVE_ADMISSION_DETAILS_SUCCESS, payload: responseData });
      message.success(`Admission details saved ${responseData.data.status}fully!`, 5);
    }, 1200);

    return responseData.data;

  } catch (error) {
    // Extract the specific part of the error message starting from "An admission for this patient ..."
    const errorMessage = error.response?.data?.errors?.match(/An admission for this patient.*/)?.[0] || "An error occurred.";

    // Dispatch failure action with trimmed message
    dispatch({
      type: SAVE_ADMISSION_DETAILS_FAIL,
      payload: errorMessage,
    });

    // Show the trimmed error message
    message.error(errorMessage);

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
      data: response.data, 
    };

    // Dispatch success after a small delay
    setTimeout(() => {
      dispatch({
        type: REQUEST_PATIENT_ADMISSION_SUCCESS,
        payload: responseData,
      });

      message.success(`Admission No ${responseData.data.admissionNo} requested ${responseData.data.status}fully!`, 5);

    }, 2000);
    // Return the patient ID for further use
    return responseData.data; 

  } catch (error) {
  
    setTimeout(() => {
      dispatch({
        type: REQUEST_PATIENT_ADMISSION_FAIL,
        payload: error.response?.data?.message|| error.errors,
      });
      message.error(error.response?.data?.errors || error.errors);
    }, 1200);

   
  

    // Rethrow error for any additional handling
    throw error;
  }
};