
import { message } from "antd";
import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;


export const POST_PSYCHOLOGY_REQUEST_REVIEW_REQUEST = "POST_PSYCHOLOGY_REQUEST_REVIEW_REQUEST";
export const POST_PSYCHOLOGY_REQUEST_REVIEW_SUCCESS = "POST_PSYCHOLOGY_REQUEST_REVIEW_SUCCESS";
export const POST_PSYCHOLOGY_REQUEST_REVIEW_FAIL = "POST_PSYCHOLOGY_REQUEST_REVIEW_FAIL";
export const POST_PSYCHOLOGY_REQUEST_REVIEW_RESET = "POST_PSYCHOLOGY_REQUEST_REVIEW_RESET";
export const postPsychologyRequestReviewSlice  = (radiologyRequest) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_PSYCHOLOGY_REQUEST_REVIEW_REQUEST });
  
      const {
        auth: { user }
      } = getState();
      const branchCode = user.branchCode;
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          staffNo: user.staffNo, // Add staffNo as a custom header
           // Add sessionToken as a Bearer token
          branchCode: branchCode,
        },
      };
  
  const requestData = {
    ...radiologyRequest,
    staffNo: user.staffNo,
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
        dispatch({ type: POST_PSYCHOLOGY_REQUEST_REVIEW_SUCCESS, payload: responseData });
        message.success("Radiology Requested Successfully", 2);
      }, 2000);
  
      // Return patient ID for further use
      return responseData; // `msg` contains the patient ID
    } catch (error) {
     setTimeout(() => {
        dispatch({
          type: POST_PSYCHOLOGY_REQUEST_REVIEW_FAIL,
          payload: error.response?.data?.message || error.errors,
        });
        message.error(error.response?.data?.errors || error.errors);
      }, 1200);
      throw error; // Rethrow error for `handleSubmit` to handle
    }
  };
  