import axios from "axios";
import { message } from "antd"; // Import Ant Design message for error handling

const API = "https://chiromo.potestastechnologies.net:8085/";

export const REQUEST_UNPOSTED_CHARGES = "REQUEST_UNPOSTED_CHARGES";
export const REQUEST_UNPOSTED_CHARGES_SUCCESS = "REQUEST_UNPOSTED_CHARGES_SUCCESS";
export const REQUEST_UNPOSTED_CHARGES_FAIL = "REQUEST_UNPOSTED_CHARGES_FAIL";
export const REQUEST_UNPOSTED_CHARGES_RESET = "REQUEST_UNPOSTED_CHARGES_RESET";

export const getUnpostedCharges = (patientNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_UNPOSTED_CHARGES });

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
      `${API}data/odatafilter?webservice=QyPatientCharges&isList=true&query=$filter=Patient_No eq '${patientNo}'`,
      config
    );

    dispatch({ type: REQUEST_UNPOSTED_CHARGES_SUCCESS, payload: response.data });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch receipt lines";

    // Display error message using Ant Design's message component
    message.error(errorMessage);

    dispatch({ type: REQUEST_UNPOSTED_CHARGES_FAIL, payload: errorMessage });
  }
};
