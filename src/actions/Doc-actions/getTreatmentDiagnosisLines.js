import axios from "axios";
import { message } from "antd"; // Import Ant Design message for error handling

const API = "https://chiromo.potestastechnologies.net:8085/";


export const REQUEST_TREATMENT_DIAGNOSIS_LINES = "REQUEST_TREATMENT_DIAGNOSIS_LINES";
export const REQUEST_TREATMENT_DIAGNOSIS_LINES_SUCCESS = "REQUEST_TREATMENT_DIAGNOSIS_LINES_SUCCESS";
export const REQUEST_TREATMENT_DIAGNOSIS_LINES_FAIL = "REQUEST_TREATMENT_DIAGNOSIS_LINES_FAIL";
export const REQUEST_TREATMENT_DIAGNOSIS_LINES_RESET = "REQUEST_TREATMENT_DIAGNOSIS_LINES_RESET";

export const getTreatmentDiagnosisLinesSlice = (treatmentNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_TREATMENT_DIAGNOSIS_LINES });

    // Extract userInfo and branchCode
    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem("branchCode");

    if (!userInfo?.userData) {
      throw new Error("User information is missing. Please log in again.");
    }

    // Configure headers for the API request
    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no,
        sessionToken: userInfo.userData.portalSessionToken,
        branchCode: branchCode || "defaultBranch", // Fallback if branchCode is null
      },
    };

    // Perform the API request
    const response = await axios.get(
      `${API}data/odatafilter?webservice=QyTreatmentDiagnosisLines&isList=true&query=$filter=TreatmentNo eq '${treatmentNo}'`,
      config
    );

    dispatch({ type: REQUEST_TREATMENT_DIAGNOSIS_LINES_SUCCESS, payload: response.data });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch treatment diagnosis lines";

    // Display error notification
    message.error(errorMessage);

    dispatch({ type: REQUEST_TREATMENT_DIAGNOSIS_LINES_FAIL, payload: errorMessage });
  }
};