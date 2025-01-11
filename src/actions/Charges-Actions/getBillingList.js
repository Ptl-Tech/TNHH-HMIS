import axios from "axios";
import { message } from "antd";

const API = "http://217.21.122.62:8085/";

// Action Types
export const GET_BILLING_LIST_REQUEST = "GET_BILLING_LIST_REQUEST";
export const GET_BILLING_LIST_SUCCESS = "GET_BILLING_LIST_SUCCESS";
export const GET_BILLING_LIST_FAIL = "GET_BILLING_LIST_FAIL";
export const GET_BILLING_LIST_RESET = "GET_BILLING_LIST_RESET";

// Action to fetch billing list
export const getBillingList = () => async (dispatch, getState) => {
  try {
    // Dispatch initial request action
    dispatch({ type: GET_BILLING_LIST_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();

    // Retrieve branch code from localStorage or fallback to empty string
    const branchCode = localStorage.getItem("branchCode") || "";

    // Configure request headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo?.userData?.no || "",
        sessionToken: userInfo?.userData?.portalSessionToken || "",
        branchCode,
      },
    };

    // Make API request to fetch billing list
    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=PgPatientsList`, // Adjusted endpoint for billing list
      config
    );

    // Dispatch success action with data
    dispatch({
      type: GET_BILLING_LIST_SUCCESS,
      payload: data,
    });

    return data; // Return the data for any further usage
  } catch (error) {
    // Handle and extract error messages
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";

    // Dispatch failure action with error message
    dispatch({
      type: GET_BILLING_LIST_FAIL,
      payload: errorMessage,
    });

    // Display error message to the user
    message.error(errorMessage, 5);

    throw error; // Rethrow error for further handling if necessary
  }
};
