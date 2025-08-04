import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const GET_TRANSACTION_LIST_REQUEST = "GET_TRANSACTION_LIST_REQUEST";
export const GET_TRANSACTION_LIST_SUCCESS = "GET_TRANSACTION_LIST_SUCCESS";
export const GET_TRANSACTION_LIST_FAIL = "GET_TRANSACTION_LIST_FAIL";
export const GET_TRANSACTION_LIST_RESET = "GET_TRANSACTION_LIST_RESET";

export const getTransactionListSetup = () => async (dispatch, getState) => { 
  try {
    dispatch({ type: GET_TRANSACTION_LIST_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();
    // Fetch branchCode from localStorage
    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=PgTransactionsList`,
      config
    );

    dispatch({ type: GET_TRANSACTION_LIST_SUCCESS, payload: data });

  } catch (error) {
    // Check if it's an axios error
    const errorMessage = error.response
      ? error.response.data.message || error.response.statusText
      : error.message;
    
    dispatch({ type: GET_TRANSACTION_LIST_FAIL, payload: errorMessage });
  }
};
