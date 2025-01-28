import configHelpers from '../configHelpers';
import axios from "axios";

export const POST_DISCHARGE_PATIENT_REQUEST = 'POST_DISCHARGE_PATIENT_REQUEST';
export const POST_DISCHARGE_PATIENT_SUCCESS = 'POST_DISCHARGE_PATIENT_SUCCESS';
export const POST_DISCHARGE_PATIENT_FAILURE = 'POST_DISCHARGE_PATIENT_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const postPostDischargeSlice = (endpoint = '/Inpatient/PostDischarge', dischargeData) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: POST_DISCHARGE_PATIENT_REQUEST });

        const { data } = await axios.post(`${API_URL}${endpoint}`, dischargeData, config);
    

        dispatch({ type: POST_DISCHARGE_PATIENT_SUCCESS, payload: data });

        return { type: POST_DISCHARGE_PATIENT_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: POST_DISCHARGE_PATIENT_FAILURE,
            payload: error.response?.data?.message || error.message,
        });

        return { type: POST_DISCHARGE_PATIENT_FAILURE, payload: error };
    }
};
