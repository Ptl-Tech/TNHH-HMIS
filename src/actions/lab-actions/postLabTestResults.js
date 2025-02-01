import axios from 'axios';
import apiHeaderConfig from '../configHelpers';

export const POST_LAB_TEST_RESULTS_FAIL = 'POST_LAB_TEST_RESULTS_FAIL';
export const POST_LAB_TEST_RESULTS_REQUEST = 'POST_LAB_TEST_RESULTS_REQUEST';
export const POST_LAB_TEST_RESULTS_SUCCESS = 'POST_LAB_TEST_RESULTS_SUCCESS';

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const postLabTestResults = (results) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_LAB_TEST_RESULTS_REQUEST });

    const config = apiHeaderConfig(getState);

    const finalResults = {
      myAction: 'edit',
      results,
    };

    console.log({ finalResults });

    // const { data } = await axios.post(`${API_URL}/Lab/Sample`, sample, config);

    const data = { success: true };

    dispatch({ type: POST_LAB_TEST_RESULTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: POST_LAB_TEST_RESULTS_FAIL,
      payload: error.message,
      status: error.response?.status || 'Network Error',
      data: error.response?.data || null,
    });
  }
};
