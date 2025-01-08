import axios from "axios";
import { message } from "antd"; // Import Ant Design message for error handling

// Base API URL
const API = "http://217.21.122.62:8085/";

// Action Types
export const GET_PHARMACY_HISTORY_LIST_REQUEST = "GET_PHARMACY_HISTORY_LIST_REQUEST";
export const GET_PHARMACY_HISTORY_LIST_SUCCESS = "GET_PHARMACY_HISTORY_LIST_SUCCESS";
export const GET_PHARMACY_HISTORY_LIST_FAILURE = "GET_PHARMACY_HISTORY_LIST_FAILURE";
export const GET_PHARMACY_HISTORY_LIST_RESET = "GET_PHARMACY_HISTORY_LIST_RESET";

// Action to fetch Pharmacy History List
export const getPharmacyHistoryList = () => async (dispatch, getState) => {
  try {
    // Dispatch request action
    dispatch({ type: GET_PHARMACY_HISTORY_LIST_REQUEST });

    // Retrieve user information and branch code from state and localStorage
    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem("branchCode");

    // Config for API request headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo?.userData?.no, // Staff number
        sessionToken: userInfo?.userData?.portalSessionToken, // Session token
        branchCode: branchCode, // Branch code from localStorage
      },
    };

    // Make the API request to fetch pharmacy history list
    const response = await axios.get(
      `${API}data/odatafilter?webservice=PgPharmacyListHistory&isList=true`,
      config
    );

    // Dispatch success action with response data
    dispatch({ type: GET_PHARMACY_HISTORY_LIST_SUCCESS, payload: response.data });
  } catch (error) {
    // Extract error message from response or fallback to a generic message
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch pharmacy history";

    // Display error message using Ant Design's message component
    message.error(errorMessage);

    // Dispatch failure action with the error message
    dispatch({ type: GET_PHARMACY_HISTORY_LIST_FAILURE, payload: errorMessage });
  }
};
