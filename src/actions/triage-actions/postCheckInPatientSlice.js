import axios from 'axios';
import apiHeaderConfig from '../configHelpers';

export const POST_CHECK_IN_PATIENT_FAIL = 'POST_CHECK_IN_PATIENT_FAIL';
export const POST_CHECK_IN_PATIENT_RESET = 'POST_CHECK_IN_PATIENT_RESET';
export const POST_CHECK_IN_PATIENT_REQUEST = 'POST_CHECK_IN_PATIENT_REQUEST';
export const POST_CHECK_IN_PATIENT_SUCCESS = 'POST_CHECK_IN_PATIENT_SUCCESS';

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL ||
  'https://chiromo.potestastechnologies.net:8085';

export const postCheckInPatientSlice =
  (observationNo) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_CHECK_IN_PATIENT_REQUEST });

      const config = apiHeaderConfig(getState);
      const response = await axios.post(
        `${API_URL}/Triage/CheckinPatient`,
        observationNo,
        config,
      );

      dispatch({ type: POST_CHECK_IN_PATIENT_SUCCESS, payload: response.data });

      return response.data;
    } catch (error) {
      dispatch({ type: POST_CHECK_IN_PATIENT_FAIL, payload: error });
    }
  };
