import axios from "axios";
import { message } from "antd"; // Ensure message is imported

const API = "https://chiromo.potestastechnologies.net:8085/";

// Action Types
export const POST_PATIENT_ADMISSION = "POST_PATIENT_ADMISSION";
export const POST_PATIENT_ADMISSION_SUCCESS = "POST_PATIENT_ADMISSION_SUCCESS";
export const POST_PATIENT_ADMISSION_FAIL = "POST_PATIENT_ADMISSION_FAIL";
export const POST_PATIENT_ADMISSION_RESET = "POST_PATIENT_ADMISSION_RESET";



// Action to POST patient admission
export const postPatientAdmission = (admissionNo) => async (dispatch, getState) => {
  console.log('admission number', admissionNo)
  try {
    // Dispatch the POST start action
    dispatch({ type: POST_PATIENT_ADMISSION });

    // Get user info and branch code from state and local storage
    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem("branchCode");

    // Configure headers for the POST
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
      `${API}Admission/AdmitPatient`, // Endpoint for POSTing admission
      
      admissionNo
      ,
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
        type: POST_PATIENT_ADMISSION_SUCCESS,
        payload: responseData,
      });
    }, 2000);

    // Return the patient ID for further use
    return responseData.data; 

  } catch (error) {
  
    setTimeout(() => {
      dispatch({
        type: POST_PATIENT_ADMISSION_FAIL,
        payload: error.response?.data || error.errors,
      });
      message.error(error.response?.data?.errors || error.errors);
    }, 1200);

   
  

    // Rethrow error for any additional handling
    throw error;
  }
};