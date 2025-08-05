import axios from 'axios';
import { message } from 'antd';

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

// Action Types
export const REQUEST_RADIOLOGY_DETAILS = 'REQUEST_RADIOLOGY_DETAILS';
export const REQUEST_RADIOLOGY_DETAILS_FAIL = 'REQUEST_RADIOLOGY_DETAILS_FAIL';
export const REQUEST_RADIOLOGY_DETAILS_RESET =
  'REQUEST_RADIOLOGY_DETAILS_RESET';
export const REQUEST_RADIOLOGY_DETAILS_SUCCESS =
  'REQUEST_RADIOLOGY_DETAILS_SUCCESS';

export const getRadiologyDetails =
  (radiologyNo) => async (dispatch, getState) => {
    try {
      dispatch({ type: REQUEST_RADIOLOGY_DETAILS });

      const {
        auth: { user }
      } = getState();

      const branchCode = user.branchCode

      // Set up the request configuration with headers
      const config = {
        headers: {
          'Content-Type': 'application/json',
          staffNo:  user.staffNo,
          branchCode,
        },
      };

      // API request
      const { data } = await axios.get(
        `${API}data/odatafilter?isList=true&webservice=QyRadiologyLines&query=$filter=Radiology_no eq '${radiologyNo}'`,

        config,
      );

      console.log({ data, radiologyNo });

      // Dispatch success action with the fetched data
      dispatch({
        type: REQUEST_RADIOLOGY_DETAILS_SUCCESS,
        payload: data,
      });

      return data; // Optionally return the data
    } catch (error) {
      // Extract and handle errors properly
      const errorMessage =
        error.response?.data?.message || error.message || 'An error occurred';

      dispatch({
        type: REQUEST_RADIOLOGY_DETAILS_FAIL,
        payload: errorMessage,
      });

      message.error(errorMessage, 5); // Display the error message to the user

      throw error; // Rethrow the error if needed
    }
  };
