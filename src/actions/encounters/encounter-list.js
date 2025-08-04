import axios from 'axios';
import apiHeaderConfig from '../configHelpers';

export const GET_ENCOUNTER_LIST_FAIL = 'GET_ENCOUNTER_LIST_FAIL';
export const GET_ENCOUNTER_LIST_RESET = 'GET_ENCOUNTER_LIST_RESET';
export const GET_ENCOUNTER_LIST_REQUEST = 'GET_ENCOUNTER_LIST_REQUEST';
export const GET_ENCOUNTER_LIST_SUCCESS = 'GET_ENCOUNTER_LIST_SUCCESS';

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL ||
  'https://chiromo.potestastechnologies.net:8091';

export const getEncounterList = (patientNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_ENCOUNTER_LIST_REQUEST });

    const config = apiHeaderConfig(getState);

    const { data } = await axios.get(
      `${API_URL}/Appointment/GetPastEncounterList?patientNo=${patientNo}`,
      config,
    );

    dispatch({ type: GET_ENCOUNTER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_ENCOUNTER_LIST_FAIL,
      payload: error.message,
      status: error.response?.status || 'Network Error',
      data: error.response?.data || null,
    });
  }
};
