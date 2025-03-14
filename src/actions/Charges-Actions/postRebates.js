import { message } from "antd";
import axios from "axios";

const API = "https://chiromo.potestastechnologies.net:8085/";

export const POST_REBATES_REQUEST = "POST_REBATES_REQUEST";
export const POST_REBATES_SUCCESS = "POST_REBATES_SUCCESS";
export const POST_REBATES_FAIL = "POST_REBATES_FAIL";
export const POST_REBATES_RESET = "POST_REBATES_RESET";

export const postRebates =
  (rebatesData) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_REBATES_REQUEST });

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
        `${API}GeneralProcesses/SHIFRebatesCalculation`,
        rebatesData,
        config
      );

      // Extract and validate the response data
      const { status } = response.data;
      dispatch({
        type: POST_REBATES_SUCCESS,
        payload: { status, ReceiptNo },
      });
      message.success(`Patient Rebates allocated: ${status} fully`);
    } catch (error) {
        console.error(error);
      // Dispatch failure action
      dispatch({
        type: POST_REBATES_FAIL,
        payload: error.response?.data?.message || error.errors || error.message,
      });

      // Display error message
      message.error(error.response?.data?.message || "Failed to Post Receipt.");

      // Rethrow error for handling by other parts of the app
      throw error;
    }
  };
