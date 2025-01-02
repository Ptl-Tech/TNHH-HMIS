
import configHelpers from '../configHelpers';
import axios from "axios";

export const GET_PATIENT_CONSUMABLES_REQUEST = 'GET_PATIENT_CONSUMABLES_REQUEST';
export const GET_PATIENT_CONSUMABLES_SUCCESS = 'GET_PATIENT_CONSUMABLES_SUCCESS';
export const GET_PATIENT_CONSUMABLES_FAILURE = 'GET_PATIENT_CONSUMABLES_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const getPatientConsumablesSlice = (admissionNo) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_PATIENT_CONSUMABLES_REQUEST });

        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=PgPostedPatientConsumables&isList=true&query=$filter=AdmissionNo eq '${admissionNo}'`, config);
    

        dispatch({ type: GET_PATIENT_CONSUMABLES_SUCCESS, payload: data });

        return { type: GET_PATIENT_CONSUMABLES_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: GET_PATIENT_CONSUMABLES_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            },
        });

        return { type: GET_PATIENT_CONSUMABLES_FAILURE, payload: error };
    }
};
