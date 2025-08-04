import axios from 'axios';
import apiHeaderConfig from '../configHelpers';

export const POST_ALLERGIES_MEDICATION_REQUEST =
  'POST_ALLERGIES_MEDICATION_REQUEST';
export const POST_ALLERGIES_MEDICATION_SUCCESS =
  'POST_ALLERGIES_MEDICATION_SUCCESS';
export const POST_ALLERGIES_MEDICATION_RESET =
  'POST_ALLERGIES_MEDICATION_RESET';
export const POST_ALLERGIES_MEDICATION_FAIL = 'POST_ALLERGIES_MEDICATION_FAIL';

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL ||
  'https://chiromo.potestastechnologies.net:8091';

export const postAllergiesMedicationSlice =
  (allergiesMedication) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_ALLERGIES_MEDICATION_REQUEST });

      const config = apiHeaderConfig(getState);
      const response = await axios.post(
        `${API_URL}/Triage/AlergiesMedication`,
        allergiesMedication,
        config,
      );

      console.log('config', response);

      dispatch({
        type: POST_ALLERGIES_MEDICATION_SUCCESS,
        payload: response.data,
      });

      return response.data;
    } catch (error) {
      dispatch({
        type: POST_ALLERGIES_MEDICATION_FAIL,
        payload: error,
      });
    }
  };
