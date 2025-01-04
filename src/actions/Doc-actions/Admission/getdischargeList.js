import axios from "axios";
import { message } from "antd"; // Ensure Ant Design's message is imported

const API = "http://217.21.122.62:8085/";
// Action Types
export const GET_DISCHARGE_LIST_REQUEST = "GET_DISCHARGE_LIST_REQUEST";
export const GET_DISCHARGE_LIST_SUCCESS = "GET_DISCHARGE_LIST_SUCCESS";
export const GET_DISCHARGE_LIST_FAILURE = "GET_DISCHARGE_LIST_FAILURE";
export const GET_DISCHARGE_LIST_RESET = "GET_DISCHARGE_LIST_RESET";


export const GET_DISCHARGE_REQUEST_LIST = "GET_DISCHARGE_REQUEST_LIST";
export const GET_DISCHARGE_REQUEST_LIST_SUCCESS = "GET_DISCHARGE_REQUEST_LIST_SUCCESS";
export const GET_DISCHARGE_REQUEST_LIST_FAILURE = "GET_DISCHARGE_REQUEST_LIST_FAILURE";
export const GET_DISCHARGE_REQUEST_LIST_RESET = "GET_DISCHARGE_REQUEST_LIST_RESET";

// Action to VERIFY patient admission
export const getDischargeList = () => async (dispatch, getState) => {
  try {
    // Dispatch the VERIFY start action
    dispatch({ type: GET_DISCHARGE_LIST_REQUEST });

    // Get user info and branch code from state and local storage
    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem("branchCode");

    // Configure headers for the VERIFY
    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo?.userData?.no, // Custom header with staff number
        sessionToken: userInfo?.userData?.portalSessionToken, // Bearer token for session
        branchCode, // Branch code from local storage
      },
    };

    // Make the GET request
    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=PgInpatientDischargeList&isList=true`,
      config
    );

    // Dispatch success action after a small delay
    setTimeout(() => {
      dispatch({
        type: GET_DISCHARGE_LIST_SUCCESS,
        payload: data,
      });
    }, 2000);

    // Return the response data for further use
    return data;
  } catch (error) {
    // Handle the error and dispatch failure action
    setTimeout(() => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors ||
        error.message ||
        "An error occurred";
      dispatch({
        type: GET_DISCHARGE_LIST_FAILURE,
        payload: errorMessage,
      });
      message.error(errorMessage);
    }, 1200);

    // Rethrow error for any additional handling
    throw error;
  }
};

export const getDischargeRequestList = () => async (dispatch, getState) => {
    try {
      // Dispatch the VERIFY start action
      dispatch({ type: GET_DISCHARGE_REQUEST_LIST });
  
      // Get user info and branch code from state and local storage
      const {
        otpVerify: { userInfo },
      } = getState();
      const branchCode = localStorage.getItem("branchCode");
  
      // Configure headers for the VERIFY
      const config = {
        headers: {
          "Content-Type": "application/json",
          staffNo: userInfo?.userData?.no, // Custom header with staff number
          sessionToken: userInfo?.userData?.portalSessionToken, // Bearer token for session
          branchCode, // Branch code from local storage
        },
      };
  
      // Make the GET request
      const { data } = await axios.get(
        `${API}data/odatafilter?webservice=PgInpatientDischargeRequests&isList=true`,
        config
      );
  
      // Dispatch success action after a small delay
      setTimeout(() => {
        dispatch({
          type: GET_DISCHARGE_REQUEST_LIST_SUCCESS,
          payload: data,
        });
      }, 2000);
  
      // Return the response data for further use
      return data;
    } catch (error) {
      // Handle the error and dispatch failure action
      setTimeout(() => {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.errors ||
          error.message ||
          "An error occurred";
        dispatch({
          type: GET_DISCHARGE_REQUEST_LIST_FAILURE,
          payload: errorMessage,
        });
        message.error(errorMessage);
      }, 1200);
  
      // Rethrow error for any additional handling
      throw error;
    }
  };