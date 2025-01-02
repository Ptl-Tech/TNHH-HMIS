import configHelpers from '../configHelpers';
import axios from "axios";

export const POST_REQUEST_PATIENT_ADMISSION_REQUEST = 'POST_REQUEST_PATIENT_ADMISSION_REQUEST';
export const POST_REQUEST_PATIENT_ADMISSION_SUCCESS = 'POST_REQUEST_PATIENT_ADMISSION_SUCCESS';
export const POST_REQUEST_PATIENT_ADMISSION_FAILURE = 'POST_REQUEST_PATIENT_ADMISSION_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const postRequestPatientAdmissionSlice = (endpoint = '/Doctor/RequestPatientAdmission', requestAdmissionData) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: POST_REQUEST_PATIENT_ADMISSION_REQUEST });

        const { data } = await axios.post(`${API_URL}${endpoint}`, requestAdmissionData, config);
    

        dispatch({ type: POST_REQUEST_PATIENT_ADMISSION_SUCCESS, payload: data });

        return { type: POST_REQUEST_PATIENT_ADMISSION_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: POST_REQUEST_PATIENT_ADMISSION_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            },
        });

        return { type: POST_REQUEST_PATIENT_ADMISSION_FAILURE, payload: error };
    }
};
