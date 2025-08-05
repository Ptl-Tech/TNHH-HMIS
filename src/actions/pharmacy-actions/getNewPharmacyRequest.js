import axios from 'axios';
import { message } from 'antd'; // Import Ant Design message for error handling

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const GET_NEW_PHARMACY_REQUESTS = 'GET_NEW_PHARMACY_REQUESTS';
export const GET_NEW_PHARMACY_REQUESTS_SUCCESS =
  'GET_NEW_PHARMACY_REQUESTS_SUCCESS';
export const GET_NEW_PHARMACY_REQUESTS_FAILURE =
  'GET_NEW_PHARMACY_REQUESTS_FAILURE';
export const GET_NEW_PHARMACY_REQUESTS_RESET =
  'GET_NEW_PHARMACY_REQUESTS_RESET';

export const getNewPharmacyRequests =
  (parameterType = '', parameterValue = '') =>
  async (dispatch, getState) => {
    const newParameterValue =
      typeof parameterValue === 'boolean'
        ? parameterValue
        : `'${parameterValue}'`;
    const query =
      parameterType && parameterValue
        ? `&query=$filter=${parameterType} eq ${newParameterValue}`
        : '';

    try {
      dispatch({ type: GET_NEW_PHARMACY_REQUESTS });

      const {
        auth: { user }
      } = getState();
      const branchCode = user.branchCode

      const config = {
        headers: {
          'Content-Type': 'application/json',
          staffNo: user.staffNo,
         
          branchCode: branchCode,
        },
      };

      const finalQuery = `${API}data/odatafilter?webservice=PgPharmacyListNew&isList=true${query}`;
      
      const response = await axios.get(finalQuery, config);

      dispatch({
        type: GET_NEW_PHARMACY_REQUESTS_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch diagnosis lines';

      // Display error message using Ant Design's message component
      message.error(errorMessage);

      dispatch({
        type: GET_NEW_PHARMACY_REQUESTS_FAILURE,
        payload: errorMessage,
      });
    }
  };
