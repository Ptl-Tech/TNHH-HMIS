import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const SAVE_BILLING_INFORMATION_REQUEST =
  "SAVE_BILLING_INFORMATION_REQUEST";
export const SAVE_BILLING_INFORMATION_SUCCESS =
  "SAVE_BILLING_INFORMATION_SUCCESS";
export const SAVE_BILLING_INFORMATION_FAIL = "SAVE_BILLING_INFORMATION_FAIL";
export const SAVE_BILLING_INFORMATION_RESET = "SAVE_BILLING_INFORMATION_RESET";

export const saveBillingInformation =
  (billingData) => async (dispatch, getState) => {
    try {
      dispatch({ type: SAVE_BILLING_INFORMATION_REQUEST });

      const {
        auth: { user },
      } = getState();

      const branchCode = user.branchCode;

      const config = {
        headers: {
          "Content-Type": "application/json",
          staffNo: user.staffNo, // Staff number
          // Session token
          branchCode: branchCode, // Branch Code
        },
      };

      const formattedData = {
        ...billingData, // Use billingData instead of 'data'
        branchCode: branchCode,
      };

      const response = await axios.post(
        `${API}Reception/PatientDataBilling`,
        formattedData,
        config
      );

      dispatch({
        type: SAVE_BILLING_INFORMATION_SUCCESS,
        payload: response.data,
      });
      return {
        type: SAVE_BILLING_INFORMATION_SUCCESS,
        payload: response.data,
      };
    } catch (error) {
      console.error("Error saving billing information:", error);
      dispatch({
        type: SAVE_BILLING_INFORMATION_FAIL,
        payload: error.response?.data?.errors,
      });

      throw new Error(
        error.response?.data?.errors || "Failed to save billing information."
      );
    }
  };
