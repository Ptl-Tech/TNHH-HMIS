import { message } from "antd";
import axios from "axios";

const API = "https://chiromo.potestastechnologies.net:8085/";

export const POST_REFRESH_PATIENT_CHARGES_REQUEST = "POST_REFRESH_PATIENT_CHARGES_REQUEST";
export const POST_REFRESH_PATIENT_CHARGES_SUCCESS = "POST_REFRESH_PATIENT_CHARGES_SUCCESS";
export const POST_REFRESH_PATIENT_CHARGES_FAIL = "POST_REFRESH_PATIENT_CHARGES_FAIL";
export const POST_REFRESH_PATIENT_CHARGES_RESET = "POST_REFRESH_PATIENT_CHARGES_RESET";

export const postRefreshPatientCharges =
  (payload) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_REFRESH_PATIENT_CHARGES_REQUEST });

      // Get user information and branch code from state and localStorage
      const {
        otpVerify: { userInfo },
      } = getState();
      const branchCode = localStorage.getItem("branchCode");

    
      // Set headers for the request
      const config = {
        headers: {
          "Content-Type": "application/json",
          staffNo: userInfo.userData.no,
          sessionToken: userInfo.userData.portalSessionToken,
          branchCode: branchCode,
        },
      };

      // Make the POST request to the server
      const response = await axios.post(
        `${API}Billing/RefreshPatientCharges`,
        payload,
        config
      );
      // Extract and validate the response data
      dispatch({
        type: POST_REFRESH_PATIENT_CHARGES_SUCCESS,
        payload: response.data.status,
      });
      return response.data.status;
    } catch (error) {
      // Dispatch failure action
      dispatch({
        type: POST_REFRESH_PATIENT_CHARGES_FAIL,
        payload: error.response?.data?.errors ,
      });

      // Display error message
      message.error(error.response?.data?.errors );

      // Rethrow error for handling by other parts of the app
      throw error;
    }
  };
