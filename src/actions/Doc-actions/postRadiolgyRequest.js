
import { message } from "antd";
import axios from "axios";

const API = "http://217.21.122.62:8085/";


export const POST_RADIOLOGY_REQUEST = "POST_RADIOLOGY_REQUEST";
export const POST_RADIOLOGY_SUCCESS = "POST_RADIOLOGY_SUCCESS";
export const POST_RADIOLOGY_FAIL = "POST_RADIOLOGY_FAIL";
export const postRadiologyRequest  = (radiologyRequest) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_RADIOLOGY_REQUEST });
  
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
  
  const requestData = {
    ...radiologyRequest,
    staffNo: userInfo.userData.no,
  }
      const response = await axios.post(
        `${API}Doctor/PatientRadiology`,
        requestData,
        config
      );
  
      // Extract response details
      const responseData = {
        status: response.data.status,
        data: response.data, // Assuming `msg` contains the patient ID
      };
  
      setTimeout(() => {
        dispatch({ type: POST_RADIOLOGY_SUCCESS, payload: responseData });
        message.success("Radiology Requested Successfully", 2);
      }, 2000);
  
      // Return patient ID for further use
      return responseData; // `msg` contains the patient ID
    } catch (error) {
     setTimeout(() => {
        dispatch({
          type: POST_RADIOLOGY_FAIL,
          payload: error.response?.data?.message || error.errors,
        });
        message.error(error.response?.data?.errors || error.errors);
      }, 1200);
      throw error; // Rethrow error for `handleSubmit` to handle
    }
  };
  