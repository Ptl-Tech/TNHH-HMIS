import axios from 'axios';
import { message } from 'antd'; // Import Ant Design message for error handling

const API = 'https://chiromo.potestastechnologies.net:8085/';

export const GET_PHARMACY_REQUESTS_ALL = 'GET_PHARMACY_REQUESTS_ALL';
export const GET_PHARMACY_REQUESTS_ALL_SUCCESS =
  'GET_PHARMACY_REQUESTS_ALL_SUCCESS';
export const GET_PHARMACY_REQUESTS_ALL_FAILURE =
  'GET_PHARMACY_REQUESTS_ALL_FAILURE';
export const GET_PHARMACY_REQUESTS_ALL_RESET =
  'GET_PHARMACY_REQUESTS_ALL_RESET';

const generateQuery = ({ type, status }) => {
  var query = '&query=$filter=';
  switch (type) {
    case 'WalkIn':
      query += 'Walkin eq true';
      break;
    case 'InPatient':
      query += 'InPatient eq true';
      break;
    case 'OutPatient':
      query += 'InPatient eq false and Walkin eq false';
      break;
    default:
      break;
  }

  query = query === '&query=$filter=' ? query : `${query}  and `;

  switch (status) {
    case 'New':
      query += "Status eq 'New'";
      break;
    case 'Forwarded':
      query += "Status eq 'Forwarded'";
      break;
    case 'Completed':
      query += "Status eq 'Completed'";
      break;
    case 'Cancelled':
      query += "Status eq 'Cancelled'";
      break;
    default:
      query = query.endsWith(' and ') ? query.slice(0, query.lastIndexOf(' and ')) : query;
      break;
  }
  return query === '&query=$filter=' ? '' : query;
};

export const getPharmacyRequestsAll =
  ({ type, status }) =>
  async (dispatch, getState) => {
    const query = generateQuery({ type, status });

    console.log({ type, status, query });

    try {
      dispatch({ type: GET_PHARMACY_REQUESTS_ALL });

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

      const response = await axios.get(
        `${API}data/odatafilter?webservice=PgPharmacyHeaderAll&isList=true${query}`,
        config,
      );

      console.log({ response });

      if (response.data === '') {
        return message.error(
          'The requested pharmacy header could not be found',
        );
      }
      dispatch({
        type: GET_PHARMACY_REQUESTS_ALL_SUCCESS,
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
        type: GET_PHARMACY_REQUESTS_ALL_FAILURE,
        payload: errorMessage,
      });
    }
  };
