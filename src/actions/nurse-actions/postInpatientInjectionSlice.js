import configHelpers from '../configHelpers';
import axios from "axios";

export const POST_INPATIENT_INJECTION_REQUEST = 'POST_INPATIENT_INJECTION_REQUEST';
export const POST_INPATIENT_INJECTION_SUCCESS = 'POST_INPATIENT_INJECTION_SUCCESS';
export const POST_INPATIENT_INJECTION_FAILURE = 'POST_INPATIENT_INJECTION_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const postInpatientInjectionSlice = (endpoint = '/Inpatient/Injection', injectionsData) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: POST_INPATIENT_INJECTION_REQUEST });

        const { data } = await axios.post(`${API_URL}${endpoint}`, injectionsData, config);
    

        dispatch({ type: POST_INPATIENT_INJECTION_SUCCESS, payload: data });

        return { type: POST_INPATIENT_INJECTION_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: POST_INPATIENT_INJECTION_FAILURE,
            payload: error.response?.data?.message || error.message,
        });

        return { type: POST_INPATIENT_INJECTION_FAILURE, payload: error };
    }
};
