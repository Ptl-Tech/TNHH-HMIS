import axios from "axios";
import { message } from "antd"; // Ensure message is imported

const API = "http://217.21.122.62:8085/";

// Action Types
export const POST_PHARMACY_DRUG_ISSUANCE_REQUEST =
  "POST_PHARMACY_DRUG_ISSUANCE_REQUEST";
export const POST_PHARMACY_DRUG_ISSUANCE_SUCCESS =
  "POST_PHARMACY_DRUG_ISSUANCE_SUCCESS";
export const POST_PHARMACY_DRUG_ISSUANCE_FAILURE =
  "POST_PHARMACY_DRUG_ISSUANCE_FAILURE";
export const POST_PHARMACY_DRUG_ISSUANCE_RESET =
  "POST_PHARMACY_DRUG_ISSUANCE_RESET";

export const POST_ARCHIVE_PRESCRIPTION_REQUEST =
  "POST_ARCHIVE_PRESCRIPTION_REQUEST";
export const POST_ARCHIVE_PRESCRIPTION_SUCCESS =
  "POST_ARCHIVE_PRESCRIPTION_SUCCESS";
export const POST_ARCHIVE_PRESCRIPTION_FAILURE =
  "POST_ARCHIVE_PRESCRIPTION_FAILURE";
export const POST_ARCHIVE_PRESCRIPTION_RESET =
  "POST_ARCHIVE_PRESCRIPTION_RESET";

// Action to POST drug issuance
export const postDrugIssuance = (pharmacyNo) => async (dispatch, getState) => {
  try {
    // Dispatch the POST start action
    dispatch({ type: POST_PHARMACY_DRUG_ISSUANCE_REQUEST });

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
      `${API}Pharmacy/PostDrugIssuance`, // Endpoint for POSTing drug issuance
      { pharmacyNo }, // Send pharmacyNo as part of the POST body
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
        type: POST_PHARMACY_DRUG_ISSUANCE_SUCCESS,
        payload: responseData,
      });
    }, 2000);

    // Return the data for further use
    return responseData.data;
  } catch (error) {
    setTimeout(() => {
      dispatch({
        type: POST_PHARMACY_DRUG_ISSUANCE_FAILURE,
        payload: error.response?.data?.message || error.errors,
      });
      message.error(error.response?.data?.errors || error.errors);
    }, 1200);

    // Rethrow error for any additional handling
    throw error;
  }
};

// Action to POST archived prescription
export const postArchivePrescription = (pharmacyNo) => async (dispatch, getState) => {
  try {
    // Dispatch the POST start action
    dispatch({ type: POST_ARCHIVE_PRESCRIPTION_REQUEST });

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
      `${API}Pharmacy/ArchivePrescription`, // Endpoint for POSTing prescription
      { pharmacyNo }, // Send pharmacyNo as part of the POST body
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
        type: POST_ARCHIVE_PRESCRIPTION_SUCCESS,
        payload: responseData,
      });
    }, 2000);

    // Return the data for further use
    return responseData.data;
  } catch (error) {
    setTimeout(() => {
      dispatch({
        type: POST_ARCHIVE_PRESCRIPTION_FAILURE,
        payload: error.response?.data?.message || error.errors,
      });
      message.error(error.response?.data?.errors || error.errors);
    }, 1200);

    // Rethrow error for any additional handling
    throw error;
  }
};
