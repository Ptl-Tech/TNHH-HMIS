import configHelpers from '../configHelpers';
import axios from "axios";

export const POST_VERIFY_ADMISSION_REQUEST = 'POST_VERIFY_ADMISSION_REQUEST';
export const POST_VERIFY_ADMISSION_SUCCESS = 'POST_VERIFY_ADMISSION_SUCCESS';
export const POST_VERIFY_ADMISSION_FAILURE = 'POST_VERIFY_ADMISSION_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8091';

export const postVerifyAdmissionSlice = (admissionData) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: POST_VERIFY_ADMISSION_REQUEST });

        const { data } = await axios.post(`${API_URL}/Admission/VerifyAdmission`, admissionData, config);
    

        dispatch({ type: POST_VERIFY_ADMISSION_SUCCESS, payload: data });

        return { type: POST_VERIFY_ADMISSION_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: POST_VERIFY_ADMISSION_FAILURE,
            payload: error.response?.data?.message || error.message,
        });

        return { type: POST_VERIFY_ADMISSION_FAILURE, payload: error };
    }
};
