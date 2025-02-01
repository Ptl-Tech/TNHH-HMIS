import axios from 'axios';
import apiHeaderConfig from '../configHelpers';

export const POST_LAB_SAMPLE_FAIL = 'POST_LAB_SAMPLE_FAIL';
export const POST_LAB_SAMPLE_REQUEST = 'POST_LAB_SAMPLE_REQUEST';
export const POST_LAB_SAMPLE_SUCCESS = 'POST_LAB_SAMPLE_SUCCESS';

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const postLabSample = (sample) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_LAB_SAMPLE_REQUEST });

    const config = apiHeaderConfig(getState);

    console.log({ sample });

    const data = { success: true };

    // const { data } = await axios.post(`${API_URL}/Lab/Sample`, sample, config);

    dispatch({ type: POST_LAB_SAMPLE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: POST_LAB_SAMPLE_FAIL,
      payload: error.message,
      status: error.response?.status || 'Network Error',
      data: error.response?.data || null,
    });
  }
};
