import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://chiromo.potestastechnologies.net:8085/";

export const SAVE_BILLING_INFORMATION_REQUEST =
  "SAVE_BILLING_INFORMATION_REQUEST";
export const SAVE_BILLING_INFORMATION_SUCCESS =
  "SAVE_BILLING_INFORMATION_SUCCESS";
export const SAVE_BILLING_INFORMATION_FAIL = "SAVE_BILLING_INFORMATION_FAIL";
export const SAVE_BILLING_INFORMATION_RESET = "SAVE_BILLING_INFORMATION_RESET";

export const saveBillingInformation = (billingData) => async (dispatch, getState) => {
  try {
    dispatch({ type: SAVE_BILLING_INFORMATION_REQUEST });

    const {
        otpVerify: { userInfo },
      } = getState();
  
      if (!userInfo || !userInfo.userData) {
        navigate("/login"); // Redirect to login
        throw new Error("User information not available.");
      }
  
      const branchCode = localStorage.getItem("branchCode");
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          staffNo: userInfo.userData.no, // Staff number
          sessionToken: userInfo.userData.portalSessionToken, // Session token
          branchCode: branchCode, // Branch Code
        },
      };

    const formattedData = {
      ...billingData,  // Use billingData instead of 'data'
      branchCode: branchCode,
    };

    const response = await axios.post(
      `${API}reception/PatientRegistration`,
      formattedData,
      config
    );

    dispatch({ type: SAVE_BILLING_INFORMATION_SUCCESS, payload: response.data });
  } catch (error) {
    console.error("Error saving billing information:", error);
    dispatch({ type: SAVE_BILLING_INFORMATION_FAIL, payload: error.response?.data?.errors });

    throw new Error(error.response?.data?.errors || "Failed to save billing information.");
  }
};
