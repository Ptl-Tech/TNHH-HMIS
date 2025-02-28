import axios from 'axios';
import apiHeaderConfig from '../configHelpers';

export const POST_LAB_TEST_FAIL = 'POST_LAB_TEST_FAIL';
export const POST_LAB_TEST_RESET = 'POST_LAB_TEST_RESET';
export const POST_LAB_TEST_REQUEST = 'POST_LAB_TEST_REQUEST';
export const POST_LAB_TEST_SUCCESS = 'POST_LAB_TEST_SUCCESS';

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL ||
  'https://chiromo.potestastechnologies.net:8085';

export const postLabTest = (params) => async (dispatch, getState) => {
  const { labNo, testCode } = params;

  try {
    dispatch({ type: POST_LAB_TEST_REQUEST });

    const config = apiHeaderConfig(getState);

    console.log({ params });

    const data = { status: 'success' };

    // TODO: Change the url to match the post of the test
    // const { data } = await axios.post(
    //   `${API_URL}/Laboratory/LabTestSample`,
    //   sample,
    //   config,
    // );

    dispatch({ type: POST_LAB_TEST_SUCCESS, payload: data });
  } catch (error) {
    console.log({ error });

    dispatch({
      type: POST_LAB_TEST_FAIL,
      payload: error.message,
      status: error.response?.status || 'Network Error',
      data: error.response?.data || null,
    });
  }
};
