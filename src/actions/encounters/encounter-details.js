import axios from 'axios';
import apiHeaderConfig from '../configHelpers';

export const GET_ENCOUNTER_DETAILS_FAIL = 'GET_ENCOUNTER_DETAILS_FAIL';
export const GET_ENCOUNTER_DETAILS_RESET = 'GET_ENCOUNTER_DETAILS_RESET';
export const GET_ENCOUNTER_DETAILS_REQUEST = 'GET_ENCOUNTER_DETAILS_REQUEST';
export const GET_ENCOUNTER_DETAILS_SUCCESS = 'GET_ENCOUNTER_DETAILS_SUCCESS';

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL ||
  'https://chiromo.potestastechnologies.net:8091';

export const getEncounterDetails =
  ({ patientNo, encounterNo, patientCategory }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: GET_ENCOUNTER_DETAILS_REQUEST });

      const config = apiHeaderConfig(getState);

      const { data } = await axios.get(
        `${API_URL}/PastEncounters/GetPastEncounterDetails?patientNo=${patientNo}&encounterNo=${encounterNo}&patientCategory=${patientCategory}`,
        config,
      );

      console.log({ patientNo, config, data });

      dispatch({ type: GET_ENCOUNTER_DETAILS_SUCCESS, payload: data });
    } catch (error) {
      console.log({ error });

      dispatch({
        type: GET_ENCOUNTER_DETAILS_FAIL,
        payload: error.message,
        status: error.response?.status || 'Network Error',
        data: error.response?.data || null,
      });
    }
  };
