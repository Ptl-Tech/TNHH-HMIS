import axios from "axios";

const API = "https://chiromo.potestastechnologies.net:8085/";

// Action Types
export const GENERATE_LAB_RESULTS_REPORT_FAIL =
  "GENERATE_LAB_RESULTS_REPORT_FAIL";
export const GENERATE_LAB_RESULTS_REPORT_RESET =
  "GENERATE_LAB_RESULTS_REPORT_RESET";
export const GENERATE_LAB_RESULTS_REPORT_REQUEST =
  "GENERATE_LAB_RESULTS_REPORT_REQUEST";
export const GENERATE_LAB_RESULTS_REPORT_SUCCESS =
  "GENERATE_LAB_RESULTS_REPORT_SUCCESS";

// Action to fetch radiology list
export const generateLabResultsReport = (record) => {
  return async (dispatch, getState) => {
    const { LaboratoryNo, Lab_No, LaboratoryTestPackageCode } = record || {};
    // console.log("🚀 ~ generateLabResultsReport ~ record:", record);
    try {
      dispatch({ type: GENERATE_LAB_RESULTS_REPORT_REQUEST });
      const {
        otpVerify: { userInfo },
      } = getState();
      // Ensure `branchCode` is correctly fetched from localStorage
      const branchCode = localStorage.getItem("branchCode") || "";
      // Set up the request configuration with headers
      const config = {
        headers: {
          "Content-Type": "application/json",
          staffNo: userInfo?.userData?.no || "",
          sessionToken: userInfo?.userData?.portalSessionToken || "",
          branchCode,
        },
      };
      // API request
      const { data } = await axios.post(
        `${API}Reports/LabResultsReport`,
        {
          laboratoryNo: LaboratoryNo || Lab_No,
          laboratoryTestCode: LaboratoryTestPackageCode || "",
        },
        config
      );
      // Dispatch success action with the fetched data
      dispatch({
        type: GENERATE_LAB_RESULTS_REPORT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      // Extract and handle errors properly
      const errorMessage = error.response?.data;
      dispatch({
        type: GENERATE_LAB_RESULTS_REPORT_FAIL,
        payload: errorMessage,
      });
      throw error; // Rethrow the error if needed
    }
  };
};
