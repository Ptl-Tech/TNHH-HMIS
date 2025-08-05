import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const SAVE_MARKETING_INFORMATION_REQUEST =
  "SAVE_MARKETING_INFORMATION_REQUEST";
export const SAVE_MARKETING_INFORMATION_SUCCESS =
  "SAVE_MARKETING_INFORMATION_SUCCESS";
export const SAVE_MARKETING_INFORMATION_FAIL =
  "SAVE_MARKETING_INFORMATION_FAIL";
export const SAVE_MARKETING_INFORMATION_RESET =
  "SAVE_MARKETING_INFORMATION_RESET";

export const saveMarketingInformation =
  (formData, navigate) => async (dispatch, getState) => {
    try {
      dispatch({ type: SAVE_MARKETING_INFORMATION_REQUEST });

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
        ...formData,
        branchCode: branchCode,
      };

      const response = await axios.post(
        `${API}Reception/PatientDataGeneralInfo`,
        formattedData,
        config
      );

      dispatch({
        type: SAVE_MARKETING_INFORMATION_SUCCESS,
        payload: response.data,
      });

      return response.data;
    } catch (error) {
      dispatch({
        type: SAVE_MARKETING_INFORMATION_FAIL,
        payload:
          error.response?.data?.errors || "An error occurred while saving.",
      });

      throw error;
    }
  };
