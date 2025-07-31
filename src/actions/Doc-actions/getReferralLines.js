import axios from "axios";
import { message } from "antd"; // Import Ant Design message for error handling

const API = "https://chiromo.potestastechnologies.net:8091/";

export const REQUEST_REFERRAL_LINES = "REQUEST_REFERRAL_LINES";
export const REQUEST_REFERRAL_LINES_SUCCESS = "REQUEST_REFERRAL_LINES_SUCCESS";
export const REQUEST_REFERRAL_LINES_FAIL = "REQUEST_REFERRAL_LINES_FAIL";
export const REQUEST_REFERRAL_LINES_RESET = "REQUEST_REFERRAL_LINES_RESET";

export const getReferralLines = (treatmentId) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_REFERRAL_LINES });

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
      `${API}data/odatafilter?webservice=QyTreatmentReferralLines&isList=false&query=$filter=TreatmentNo eq '${treatmentId}'`,
      config
    );

    dispatch({ type: REQUEST_REFERRAL_LINES_SUCCESS, payload: response.data });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch referral lines";

    // Display error message using Ant Design's message component
    message.error(errorMessage);

    dispatch({ type: REQUEST_REFERRAL_LINES_FAIL, payload: errorMessage });
  }
};
