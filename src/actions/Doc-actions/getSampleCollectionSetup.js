import { message } from 'antd';
import configHelpers from '../../actions/configHelpers';
import axios from 'axios';

export const GET_SAMPLE_SETUP_REQUEST = 'GET_SAMPLE_SETUP_REQUEST';
export const GET_SAMPLE_SETUP_SUCCESS = 'GET_SAMPLE_SETUP_SUCCESS';
export const GET_SAMPLE_SETUP_FAILURE = 'GET_SAMPLE_SETUP_FAILURE';
export const GET_SAMPLE_SETUP_RESET = 'GET_SAMPLE_SETUP_RESET';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const getSpecimenSampleSetupSlice = () => async (dispatch, getState) => {
  const config = configHelpers(getState);

  try {
    dispatch({ type: GET_SAMPLE_SETUP_REQUEST });

    // Send GET request
    const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=PgSpecimensSetup&isList=true`, config);

    // Dispatch success action
    dispatch({ type: GET_SAMPLE_SETUP_SUCCESS, payload: data });

  } catch (error) {
    // Dispatch failure action
    dispatch({ type: GET_SAMPLE_SETUP_FAILURE, payload: error.message });

    // Optionally, log the error for debugging purposes
    console.error('Error fetching specimen sample setup:', error);

    // Display a message to the user
    message.error('Failed to load specimen sample setup. Please try again.');
  }
};
