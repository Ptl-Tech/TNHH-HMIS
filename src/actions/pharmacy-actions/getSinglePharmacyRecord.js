import axios from 'axios';
import { message } from 'antd'; // Import Ant Design message for error handling

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const GET_SINGLE_PHARMACY_RECORD = 'GET_SINGLE_PHARMACY_RECORD';
export const GET_SINGLE_PHARMACY_RECORD_SUCCESS =
  'GET_SINGLE_PHARMACY_RECORD_SUCCESS';
export const GET_SINGLE_PHARMACY_RECORD_FAILURE =
  'GET_SINGLE_PHARMACY_RECORD_FAILURE';
export const GET_SINGLE_PHARMACY_RECORD_RESET =
  'GET_SINGLE_PHARMACY_RECORD_RESET';

export const getSinglePharmacyRecord =
  (parameterType, paramterValue) => async (dispatch, getState) => {
    const finalParameterValue =
      typeof paramterValue === 'boolean' ? paramterValue : `'${paramterValue}'`;
    const query =
      parameterType && paramterValue
        ? `&query=$filter=${parameterType} eq ${finalParameterValue}`
        : '';
    try {
      dispatch({ type: GET_SINGLE_PHARMACY_RECORD });

      const {
        otpVerify: { userInfo },
      } = getState();
      const branchCode = localStorage.getItem('branchCode');

      const config = {
        headers: {
          'Content-Type': 'application/json',
          staffNo: userInfo?.userData?.no,
          sessionToken: userInfo?.userData?.portalSessionToken,
          branchCode: branchCode,
        },
      };

      const finalQuery = `${API}data/odatafilter?webservice=PgPharmacyHeaderAll&isList=false${query}`;
      
      const response = await axios.get(finalQuery, config);

      if (response.data === '') {
        return message.error(
          'The requested pharmacy header could not be found',
        );
      }
      dispatch({
        type: GET_SINGLE_PHARMACY_RECORD_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      console.log({ error });

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch diagnosis lines';

      // Display error message using Ant Design's message component
      message.error(errorMessage);

      dispatch({
        type: GET_SINGLE_PHARMACY_RECORD_FAILURE,
        payload: errorMessage,
      });
    }
  };
