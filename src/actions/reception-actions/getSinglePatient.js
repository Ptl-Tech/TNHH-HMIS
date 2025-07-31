import axios from 'axios';
import { message } from 'antd';

const API = 'https://chiromo.potestastechnologies.net:8091/';

// Action Types
export const GET_SINGLE_PATIENT_FAIL = 'GET_SINGLE_PATIENT_FAIL';
export const GET_SINGLE_PATIENT_RESET = 'GET_SINGLE_PATIENT_RESET';
export const GET_SINGLE_PATIENT_REQUEST = 'GET_SINGLE_PATIENT_REQUEST';
export const GET_SINGLE_PATIENT_SUCCESS = 'GET_SINGLE_PATIENT_SUCCESS';

// Action to fetch single patient
export const getSinglePatient =
  (parameterName, parameterValue) => async (dispatch, getState) => {
    try {
      dispatch({ type: GET_SINGLE_PATIENT_REQUEST });

      const {
        otpVerify: { userInfo },
      } = getState();

      // Ensure `branchCode` is correctly fetched from localStorage
      const branchCode = localStorage.getItem('branchCode') || '';

      // Set up the request configuration with headers
      const config = {
        headers: {
          'Content-Type': 'application/json',
          staffNo: userInfo?.userData?.no || '',
          sessionToken: userInfo?.userData?.portalSessionToken || '',
          branchCode,
        },
      };

      // API request
      const { data } = await axios.get(
        `${API}data/odatafilter?webservice=QyPatients&isList=false&query=$filter=${parameterName} eq '${parameterValue}'`,
        config,
      );

      console.log({ data });

      // Dispatch success action with the fetched data
      dispatch({
        type: GET_SINGLE_PATIENT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.error({ error });

      // Extract and handle errors properly
      const errorMessage =
        error.response?.data?.message || error.message || 'An error occurred';

      dispatch({
        type: GET_SINGLE_PATIENT_FAIL,
        payload: errorMessage,
      });

      message.error(errorMessage, 5); // Display the error message to the user

      throw error; // Rethrow the error if needed
    }
  };
