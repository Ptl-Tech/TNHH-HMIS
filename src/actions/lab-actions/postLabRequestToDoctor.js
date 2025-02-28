import axios from 'axios';
import apiHeaderConfig from '../configHelpers';

export const POST_LAB_TO_DOCTOR_FAIL = 'POST_LAB_TO_DOCTOR_FAIL';
export const POST_LAB_TO_DOCTOR_RESET = 'POST_LAB_TO_DOCTOR_RESET';
export const POST_LAB_TO_DOCTOR_REQUEST = 'POST_LAB_TO_DOCTOR_REQUEST';
export const POST_LAB_TO_DOCTOR_SUCCESS = 'POST_LAB_TO_DOCTOR_SUCCESS';

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL ||
  'https://chiromo.potestastechnologies.net:8085';

export const submitLabRequestToDoctor =
  (laboratoryNo) => async (dispatch, getState) => {
    console.log({ laboratoryNo });

    try {
      dispatch({ type: POST_LAB_TO_DOCTOR_REQUEST });

      const config = apiHeaderConfig(getState);

      const { data } = await axios.post(
        `${API_URL}/Laboratory/DispatchToDoctor`,
        { laboratoryNo },
        config,
      );

      dispatch({ type: POST_LAB_TO_DOCTOR_SUCCESS, payload: data });
    } catch (error) {
      console.log({ error });

      dispatch({
        type: POST_LAB_TO_DOCTOR_FAIL,
        payload: error.response.data.errors,
        status: error.response?.status || 'Network Error',
        data: error.response?.data || null,
      });
    }
  };
