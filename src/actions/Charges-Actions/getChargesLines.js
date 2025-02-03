import axios from "axios";
import { message } from "antd"; // Import Ant Design message for error handling

const API = "http://217.21.122.62:8085/";

export const REQUEST_CHARGES_LINES = "REQUEST_CHARGES_LINES";
export const REQUEST_CHARGES_LINES_SUCCESS = "REQUEST_CHARGES_LINES_SUCCESS";
export const REQUEST_CHARGES_LINES_FAIL = "REQUEST_CHARGES_LINES_FAIL";
export const REQUEST_CHARGES_LINES_RESET = "REQUEST_CHARGES_LINES_RESET";

export const getChargesLines = (patientNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_CHARGES_LINES });

    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem("branchCode");

    // Validate userInfo and branchCode for better error handling
    if (!userInfo || !branchCode) {
      throw new Error("User information or branch code is missing");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no,
        sessionToken: userInfo.userData.portalSessionToken,
        branchCode: branchCode,
      },
    };

    const response = await axios.get(
      `${API}data/odatafilter?webservice=PgPatientCharges&isList=true&query=$filter=Patient_No eq '${patientNo}'`,
      config
    );

    dispatch({ type: REQUEST_CHARGES_LINES_SUCCESS, payload: response.data });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch receipt lines";

    // Display error message using Ant Design's message component
    message.error(errorMessage);

    dispatch({ type: REQUEST_CHARGES_LINES_FAIL, payload: errorMessage });
  }
};
