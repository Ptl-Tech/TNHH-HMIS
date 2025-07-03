import axios from "axios";
import { message } from "antd";

const API = "https://chiromo.potestastechnologies.net:8085/";

// Action Types
export const GET_BILLING_LIST_REQUEST = "GET_BILLING_LIST_REQUEST";
export const GET_BILLING_LIST_SUCCESS = "GET_BILLING_LIST_SUCCESS";
export const GET_BILLING_LIST_FAIL = "GET_BILLING_LIST_FAIL";
export const GET_BILLING_LIST_RESET = "GET_BILLING_LIST_RESET";

// Action to fetch billing list
export const getBillingList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_BILLING_LIST_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();

    // Retrieve branch code from localStorage or fallback to empty string
    const branchCode = localStorage.getItem("branchCode") || "";

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo?.userData?.no || "",
        sessionToken: userInfo?.userData?.portalSessionToken || "",
        branchCode,
      },
    };

    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=PgPatientsList`,
      config
    );

    dispatch({
      type: GET_BILLING_LIST_SUCCESS,
      payload: data,
    });

    return filteredData; // Return only filtered data
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";

    dispatch({
      type: GET_BILLING_LIST_FAIL,
      payload: errorMessage,
    });

    message.error(errorMessage, 5);
    throw error;
  }
};
