import axios from "axios";
import { message } from "antd"; // Import Ant Design message for error handling

const API = "https://chiromo.potestastechnologies.net:8085/";

export const REQUEST_DIAGNOSIS_LINES = "REQUEST_DIAGNOSIS_LINES";
export const REQUEST_DIAGNOSIS_LINES_SUCCESS = "REQUEST_DIAGNOSIS_LINES_SUCCESS";
export const REQUEST_DIAGNOSIS_LINES_FAIL = "REQUEST_DIAGNOSIS_LINES_FAIL";
export const REQUEST_DIAGNOSIS_LINES_RESET = "REQUEST_DIAGNOSIS_LINES_RESET";

export const getDiagnosisLines = (treatmentId) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_DIAGNOSIS_LINES });

    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo?.userData?.no,
        sessionToken: userInfo?.userData?.portalSessionToken,
        branchCode: branchCode,
      },
    };

    const response = await axios.get(
      `${API}data/odatafilter?webservice=QyTreatmentDiagnosisLines&isList=true  &query=$filter=TreatmentNo eq '${treatmentId}'`,
      config
    );

    dispatch({ type: REQUEST_DIAGNOSIS_LINES_SUCCESS, payload: response.data });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch diagnosis lines";
    
    // Display error message using Ant Design's message component
    message.error(errorMessage);

    dispatch({ type: REQUEST_DIAGNOSIS_LINES_FAIL, payload: errorMessage });
  }
};
