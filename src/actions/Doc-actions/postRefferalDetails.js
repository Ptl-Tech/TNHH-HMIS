import axios from "axios";
import { message } from "antd";

const API = "https://chiromo.potestastechnologies.net:8085/";

export const POST_REFERRAL_DETAILS_REQUEST = "POST_REFERRAL_DETAILS_REQUEST";
export const POST_REFERRAL_DETAILS_SUCCESS = "POST_REFERRAL_DETAILS_SUCCESS";
export const POST_REFERRAL_DETAILS_FAIL = "POST_REFERRAL_DETAILS_FAIL";

export const POST_REFERRAL_REQUEST = "POST_REFERRAL_REQUEST";
export const POST_REFERRAL_SUCCESS = "POST_REFERRAL_SUCCESS";
export const POST_REFERRAL_FAIL = "POST_REFERRAL_FAIL";

// Post Referral Details
export const postRefferalDetails = (refferalData) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_REFERRAL_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    console.log("Referral Data:", refferalData);

    // Make the API POST request to send referral details
    const response = await axios.post(
      `${API}Doctor/PatientReferral`,
      refferalData,
      config
    );

    const responseData = {
      status: response.data.status,
      data: response.data, // Assuming response data contains patient ID or relevant info
    };

    // Dispatch success action after a short delay
    setTimeout(() => {
      dispatch({ type: POST_REFERRAL_SUCCESS, payload: responseData });
      message.success("Referral details sent successfully");
    }, 1200);

    // Return relevant data (e.g., patient ID)
    return responseData.data;
  } catch (error) {
    setTimeout(() => {
      dispatch({
        type: POST_REFERRAL_FAIL,
        payload: error.response?.data?.message || error.errors,
      });
      message.error(error.response?.data?.errors || error.errors);
    }, 1200);

    throw error; // Propagate error to handle in the component
  }
};

// Request Referral
export const requestRefferal = (treatmentId) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_REFERRAL_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    // Correctly structure the request body with treatmentNo
    const response = await axios.post(
      `${API}Doctor/RequestPatientReferral`,
      {
        treatmentNo: treatmentId, // Send treatmentNo as part of the request body
      },
      config
    );

    const responseData = {
      status: response.data.status,
      data: response.data, // Assuming response contains patient ID or other relevant info
    };

    // Dispatch success action after a short delay
    setTimeout(() => {
      dispatch({ type: POST_REFERRAL_SUCCESS, payload: responseData });
      message.success("Referral request sent successfully");
    }, 1200);

    // Return response data (e.g., patient ID)
    return responseData.data;
  } catch (error) {
    setTimeout(() => {
      dispatch({
        type: POST_REFERRAL_FAIL,
        payload: error.response?.data?.message || error.errors,
      });
      message.error(error.response?.data?.message || error.errors, 5);
    }, 1200);
    throw error; // Propagate error to handle in the component
  }
};
