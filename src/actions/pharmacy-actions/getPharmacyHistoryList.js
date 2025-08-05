import axios from "axios";
import { message } from "antd"; // Import Ant Design message for error handling

// Base API URL
const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

// Action Types
export const GET_PHARMACY_HISTORY_LIST_REQUEST =
  "GET_PHARMACY_HISTORY_LIST_REQUEST";
export const GET_PHARMACY_HISTORY_LIST_SUCCESS =
  "GET_PHARMACY_HISTORY_LIST_SUCCESS";
export const GET_PHARMACY_HISTORY_LIST_FAILURE =
  "GET_PHARMACY_HISTORY_LIST_FAILURE";
export const GET_PHARMACY_HISTORY_LIST_RESET =
  "GET_PHARMACY_HISTORY_LIST_RESET";

// Async Action to Fetch Pharmacy History List
export const getPharmacyHistoryList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_PHARMACY_HISTORY_LIST_REQUEST });

    const {
      auth: { user },
    } = getState();
    const branchCode = user.branchCode;

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: user.staffNo,

        branchCode: branchCode,
      },
    };

    const response = await axios.get(
      `${API}data/odatafilter?webservice=PgPharmacyListHistory&isList=true`,
      config
    );

    dispatch({
      type: GET_PHARMACY_HISTORY_LIST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch pharmacy history";

    message.error(errorMessage);
    dispatch({
      type: GET_PHARMACY_HISTORY_LIST_FAILURE,
      payload: errorMessage,
    });
  }
};
