import configHelpers from '../../actions/configHelpers';
import axios from 'axios';

export const GET_PATIENT_ENCOUNTER_LIST_QUEST =
  'GET_PATIENT_ENCOUNTER_LIST_REQUEST';
export const GET_PATIENT_ENCOUNTER_LIST_SUCCESS =
  'GET_PATIENT_ENCOUNTER_LIST_SUCCESS';
export const GET_PATIENT_ENCOUNTER_LIST_FAILURE =
  'GET_PATIENT_ENCOUNTER_LIST_FAILURE';

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL ||
  'https://chiromo.potestastechnologies.net:8085';

export const getPatientEncounterListSlice =
  ({ patientNo, encounterNo, appointmentNo }) =>
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    console.log('patient number', patientNo);
    try {
      dispatch({ type: GET_PATIENT_ENCOUNTER_LIST_QUEST });

      const { data } = await axios.get(
        `${API_URL}/Appointment/GetPastEncounters?patientNo=${patientNo}&encounterNo=${encounterNo}&appointmentNo=${appointmentNo}`,
        config,
      );
      dispatch({ type: GET_PATIENT_ENCOUNTER_LIST_SUCCESS, payload: data });

      return { type: GET_PATIENT_ENCOUNTER_LIST_SUCCESS, payload: data };
    } catch (error) {
      dispatch({
        type: GET_PATIENT_ENCOUNTER_LIST_FAILURE,
        payload: {
          message: error.message,
          status: error.response?.status || 'Network Error',
          data: error.response?.data || null,
        },
      });

      return { type: GET_PATIENT_ENCOUNTER_LIST_FAILURE, payload: error };
    }
  };
