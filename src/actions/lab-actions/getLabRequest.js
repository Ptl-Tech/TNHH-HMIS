import axios from 'axios';
import { message } from 'antd';

const API = 'https://chiromo.potestastechnologies.net:8085/';

// Action Types
export const GET_LAB_REQUEST_FAIL = 'GET_LAB_REQUEST_FAIL';
export const GET_LAB_REQUEST_RESET = 'GET_LAB_REQUEST_RESET';
export const GET_LAB_REQUEST_REQUEST = 'GET_LAB_REQUEST_REQUEST';
export const GET_LAB_REQUEST_SUCCESS = 'GET_LAB_REQUEST_SUCCESS';

// Action to fetch radiology list
export const getLabRequest =
  (parameter, labNo) => async (dispatch, getState) => {
    console.log({ labNo });

    try {
      dispatch({ type: GET_LAB_REQUEST_REQUEST });

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
        `${API}data/odatafilter?webservice=PgLaboratoryTestHeaders&query=$filter=${parameter} eq '${labNo}'`,
        config,
      );

      // Dispatch success action with the fetched data
      dispatch({
        type: GET_LAB_REQUEST_SUCCESS,
        payload: data[0],
      });

      return data; // Optionally return the data
    } catch (error) {
      // Extract and handle errors properly
      const errorMessage =
        error.response?.data?.message || error.message || 'An error occurred';

      dispatch({
        type: GET_LAB_REQUEST_FAIL,
        payload: errorMessage,
      });

      message.error(errorMessage, 5); // Display the error message to the user

      throw error; // Rethrow the error if needed
    }
  };
