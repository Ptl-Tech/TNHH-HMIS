import axios from "axios";
import { message } from "antd"; // Import Ant Design message for error handling

const API = "http://217.21.122.62:8085/";

export const REQUEST_Radiology_TEST = "REQUEST_Radiology_TEST";
export const REQUEST_Radiology_TEST_SUCCESS = "REQUEST_Radiology_TEST_SUCCESS";
export const REQUEST_Radiology_TEST_FAIL = "REQUEST_Radiology_TEST_FAIL";

export const requestRadiologyTest = (treatmentId) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_Radiology_TEST });

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

    // Corrected API endpoint without extra space
    const response = await axios.post(
      `${API}Doctor/RequestPatientRadiologyTests`, // Fixed URL
      {
        treatmentNo: treatmentId, // Send treatmentNo as part of the request body
      },
      config
    );

    // Extract response details
    const responseData = {
      status: response.data.status,
      data: response.data, // Assuming response contains required patient data
    };

    dispatch({ type: REQUEST_Radiology_TEST_SUCCESS, payload: responseData });

    // Return patient data for further use if necessary
    return responseData.data;
  } catch (error) {
    dispatch({
      type: REQUEST_Radiology_TEST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    // Show error message using Ant Design's message component
    message.error(error.message, 5);
    throw error; // Rethrow error for further handling by the calling function
  }
};
