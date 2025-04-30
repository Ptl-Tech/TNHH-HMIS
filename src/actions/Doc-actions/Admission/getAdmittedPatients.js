import axios from "axios";
import { message, notification } from "antd"; // Ensure Ant Design's message is imported

const API = "https://chiromo.potestastechnologies.net:8085/";

export const GET_VERIFIED_ADMITTED_PATIENTS_REQUEST = "GET_VERIFIED_ADMITTED_PATIENTS_REQUEST";
export const GET_VERIFIED_ADMITTED_PATIENTS_SUCCESS = "GET_VERIFIED_ADMITTED_PATIENTS_SUCCESS";
export const GET_VERIFIED_ADMITTED_PATIENTS_FAIL = "GET_VERIFIED_ADMITTED_PATIENTS_FAIL";
export const GET_VERIFIED_ADMITTED_PATIENTS_RESET = "GET_VERIFIED_ADMITTED_PATIENTS_RESET";


export const GET_VERIFIED_SINGLE_ADMITTED_PATIENTS_REQUEST = "GET_VERIFIED_SINGLE_ADMITTED_PATIENTS_REQUEST";
export const GET_VERIFIED_SINGLE_ADMITTED_PATIENTS_SUCCESS = "GET_VERIFIED_SINGLE_ADMITTED_PATIENTS_SUCCESS";
export const GET_VERIFIED_SINGLE_ADMITTED_PATIENTS_FAIL = "GET_VERIFIED_SINGLE_ADMITTED_PATIENTS_FAIL";
export const GET_VERIFIED_SINGLE_ADMITTED_PATIENTS_RESET = "GET_VERIFIED_SINGLE_ADMITTED_PATIENTS_RESET";

// Action to VERIFY patient admission
export const getAdmittedPatients = () => async (dispatch, getState) => {
  try {
    // Dispatch the VERIFY start action
    dispatch({ type: GET_VERIFIED_ADMITTED_PATIENTS_REQUEST });

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
      `${API}data/odatafilter?webservice=PgAdmissionsAdmitted&isList=true`,
      config
    );

    // Dispatch success action after a small delay
    setTimeout(() => {
      dispatch({
        type: GET_VERIFIED_ADMITTED_PATIENTS_SUCCESS,
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
        type: GET_VERIFIED_ADMITTED_PATIENTS_FAIL,
        payload: errorMessage,
      });
      message.error(errorMessage);
    }, 1200);

    // Rethrow error for any additional handling
    throw error;
  }
};

export const getAdmittedSinglePatient = (admissionNo, treatmentNo) => async (dispatch, getState) => {
  try {
    // Guard: Ensure at least one identifier is provided
    if (!admissionNo && !treatmentNo) {
      notification.error({
        message: "Please provide either Admission No or Treatment No.",
        duration: 2,
      })
    }

    dispatch({ type: GET_VERIFIED_SINGLE_ADMITTED_PATIENTS_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo?.userData?.no,
        sessionToken: userInfo?.userData?.portalSessionToken,
        branchCode,
      },
    };

    // Determine which column and value to filter by
    const filterColumn = admissionNo ? 'Admission_No' : 'Treatment_No';
    const filterValue = admissionNo || treatmentNo;

    // Construct dynamic URL
    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=PgAdmissionsAdmitted&isList=true&query=$filter=${filterColumn} eq '${filterValue}'`,
      config
    );

    setTimeout(() => {
      dispatch({
        type: GET_VERIFIED_SINGLE_ADMITTED_PATIENTS_SUCCESS,
        payload: data,
      });
    }, 2000);

    return data;
  } catch (error) {
    setTimeout(() => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors ||
        error.message ||
        "An error occurred";
      dispatch({
        type: GET_VERIFIED_SINGLE_ADMITTED_PATIENTS_FAIL,
        payload: errorMessage,
      });
      message.error(errorMessage);
    }, 120
    );

    throw error;
  }
};


