import axios from 'axios';
import apiHeaderConfig from '../configHelpers';

export const POST_LAB_TEST_REMARKS_FAIL = 'POST_LAB_TEST_REMARKS_FAIL';
export const POST_LAB_TEST_REMARKS_RESET = 'POST_LAB_TEST_REMARKS_RESET';
export const POST_LAB_TEST_REMARKS_REQUEST = 'POST_LAB_TEST_REMARKS_REQUEST';
export const POST_LAB_TEST_REMARKS_SUCCESS = 'POST_LAB_TEST_REMARKS_SUCCESS';

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL ||
  'https://chiromo.potestastechnologies.net:8085';

export const postTestRemarks = (postData) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_LAB_TEST_REMARKS_REQUEST });

    const config = apiHeaderConfig(getState);

    console.log({ postData });

    const { data } = await axios.post(
      `${API_URL}/Laboratory/LabTestLine`,
      postData,
      config,
    );

    console.log({ data });

    dispatch({ type: POST_LAB_TEST_REMARKS_SUCCESS, payload: data });
  } catch (error) {
    console.log({ error });

    dispatch({
      type: POST_LAB_TEST_REMARKS_FAIL,
      payload: error.message,
      status: error.response?.status || 'Network Error',
      data: error.response?.data || null,
    });
  }
};
