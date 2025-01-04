import axios from "axios";
import { message } from "antd"; // Import Ant Design message for error handling

const API = "http://217.21.122.62:8085/";

export const GET_PHARMACY_HISTORY_LIST_REQUEST = "GET_PHARMACY_HISTORY_LIST_REQUEST";
export const GET_PHARMACY_HISTORY_LIST_SUCCESS = "GET_PHARMACY_HISTORY_LIST_SUCCESS";
export const GET_PHARMACY_HISTORY_LIST_FAILURE = "GET_PHARMACY_HISTORY_LIST_FAILURE";
export const GET_PHARMACY_HISTORY_LIST_RESET = "GET_PHARMACY_HISTORY_LIST_RESET";

// Action to fetch Pharmacy History List
export const getPharmacyHistoryList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_PHARMACY_HISTORY_LIST_REQUEST });

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
      `${API}data/odatafilter?webservice=PgPharmacyListHistory&isList=true`,
      config
    );

    dispatch({ type: GET_PHARMACY_HISTORY_LIST_SUCCESS, payload: response.data });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch pharmacy history";

    // Display error message using Ant Design's message component
    message.error(errorMessage);

    dispatch({ type: GET_PHARMACY_HISTORY_LIST_FAILURE, payload: errorMessage });
  }
};
