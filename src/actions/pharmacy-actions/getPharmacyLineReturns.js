import axios from 'axios';
import { message } from 'antd'; // Import Ant Design message for error handling

const API = 'https://chiromo.potestastechnologies.net:8085/';

// Action Types for Pharmacy Return
export const GET_PHARMACY_RETURN_LIST_REQUEST =
  'GET_PHARMACY_RETURN_LIST_REQUEST';
export const GET_PHARMACY_RETURN_LIST_SUCCESS =
  'GET_PHARMACY_RETURN_LIST_SUCCESS';
export const GET_PHARMACY_RETURN_LIST_FAILURE =
  'GET_PHARMACY_RETURN_LIST_FAILURE';
export const GET_PHARMACY_RETURN_LIST_RESET = 'GET_PHARMACY_RETURN_LIST_RESET';

// Action Types for Patient Pharmacy Return
export const GET_PATIENT_PHARMACY_RETURN_REQUEST =
  'GET_PATIENT_PHARMACY_RETURN_REQUEST';
export const GET_PATIENT_PHARMACY_RETURN_SUCCESS =
  'GET_PATIENT_PHARMACY_RETURN_SUCCESS';
export const GET_PATIENT_PHARMACY_RETURN_FAILURE =
  'GET_PATIENT_PHARMACY_RETURN_FAILURE';
export const GET_PATIENT_PHARMACY_RETURN_RESET =
  'GET_PATIENT_PHARMACY_RETURN_RESET';

// Action to get Pharmacy Return List
export const getPharmacyLineReturnList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_PHARMACY_RETURN_LIST_REQUEST });

    // Extract userInfo and branchCode from state and local storage
    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem('branchCode');

    // Configure headers for the request
    const config = {
      headers: {
        'Content-Type': 'application/json',
        staffNo: userInfo?.userData?.no,
        sessionToken: userInfo?.userData?.portalSessionToken,
        branchCode: branchCode,
      },
    };

    // Send GET request to fetch Pharmacy Line Returns
    const response = await axios.get(
      `${API}data/odatafilter?webservice=PgPharmacyLine&isList=true`,
      config,
    );

    // Dispatch success with the response data
    dispatch({
      type: GET_PHARMACY_RETURN_LIST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    // Handle error and show a message using Ant Design
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch pharmacy line returns';

    message.error(errorMessage);

    // Dispatch failure with the error message
    dispatch({ type: GET_PHARMACY_RETURN_LIST_FAILURE, payload: errorMessage });
  }
};

// Action to get Pharmacy Return by Pharmacy Number
export const getPharmacyLineReturnbyPharmacyNo =
  (pharmacyNo) => async (dispatch, getState) => {
    try {
      dispatch({ type: GET_PATIENT_PHARMACY_RETURN_REQUEST });

      // Extract userInfo and branchCode from state and local storage
      const {
        otpVerify: { userInfo },
      } = getState();
      const branchCode = localStorage.getItem('branchCode');

      // Configure headers for the request
      const config = {
        headers: {
          'Content-Type': 'application/json',
          staffNo: userInfo?.userData?.no,
          sessionToken: userInfo?.userData?.portalSessionToken,
          branchCode: branchCode,
        },
      };

      // Send GET request to fetch Pharmacy Return by Pharmacy Number
      const response = await axios.get(
        `${API}data/odatafilter?webservice=PgPharmacyLine&isList=true&query=$filter=Pharmacy_No eq '${pharmacyNo}'`,
        config,
      );
      // Dispatch success with the response data
      dispatch({
        type: GET_PATIENT_PHARMACY_RETURN_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      console.log({ error });

      // Handle error and show a message using Ant Design
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch pharmacy return data';

      message.error(errorMessage);

      // Dispatch failure with the error message
      dispatch({
        type: GET_PATIENT_PHARMACY_RETURN_FAILURE,
        payload: errorMessage,
      });
    }
  };
