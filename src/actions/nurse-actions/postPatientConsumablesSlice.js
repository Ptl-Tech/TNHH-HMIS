import configHelpers from '../configHelpers';
import axios from "axios";

export const POST_PATIENT_CONSUMABLES_REQUEST = 'POST_PATIENT_CONSUMABLES_REQUEST';
export const POST_PATIENT_CONSUMABLES_SUCCESS = 'POST_PATIENT_CONSUMABLES_SUCCESS';
export const POST_PATIENT_CONSUMABLES_FAILURE = 'POST_PATIENT_CONSUMABLES_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const postPatientConsumablesSlice = (endpoint = '/GeneralProcesses/PatientConsumables', consumablesData) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);

    try {
        dispatch({ type: POST_PATIENT_CONSUMABLES_REQUEST });

        const { data } = await axios.post(`${API_URL}${endpoint}`, consumablesData, config);
    

        dispatch({ type: POST_PATIENT_CONSUMABLES_SUCCESS, payload: data });

        return { type: POST_PATIENT_CONSUMABLES_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: POST_PATIENT_CONSUMABLES_FAILURE,
            payload: error.response?.data?.message || error.message,
        });

        return { type: POST_PATIENT_CONSUMABLES_FAILURE, payload: error };
    }
};
