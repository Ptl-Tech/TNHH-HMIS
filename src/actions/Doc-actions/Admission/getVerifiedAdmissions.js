import axios from "axios";
import { message } from "antd"; // Ensure Ant Design's message is imported

const API = "https://chiromo.potestastechnologies.net:8085/";

// Action Types
export const VERIFIED_ADMISSIONS_REQUEST = "VERIFIED_ADMISSIONS_REQUEST";
export const VERIFIED_ADMISSIONS_SUCCESS = "VERIFIED_ADMISSIONS_SUCCESS";
export const VERIFIED_ADMISSIONS_FAIL = "VERIFIED_ADMISSIONS_FAIL";
export const VERIFIED_ADMISSIONS_RESET = "VERIFIED_ADMISSIONS_RESET";

// Action to VERIFY patient admission
export const getVerifiedAdmissions = () => async (dispatch, getState) => {
  try {
    // Dispatch the VERIFY start action
    dispatch({ type: VERIFIED_ADMISSIONS_REQUEST });

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
      `${API}data/odatafilter?webservice=PgAdmissionsVerified&isList=true`,
      config
    );

    // Dispatch success action after a small delay
    setTimeout(() => {
      dispatch({
        type: VERIFIED_ADMISSIONS_SUCCESS,
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
        type: VERIFIED_ADMISSIONS_FAIL,
        payload: errorMessage,
      });
      message.error(errorMessage);
    }, 1200);

    // Rethrow error for any additional handling
    throw error;
  }
};
