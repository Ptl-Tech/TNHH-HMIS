import configHelpers from '../configHelpers';
import axios from "axios";

export const POST_ADMISSION_FORM_DETAILS_REQUEST = 'POST_ADMISSION_FORM_DETAILS_REQUEST';
export const POST_ADMISSION_FORM_DETAILS_SUCCESS = 'POST_ADMISSION_FORM_DETAILS_SUCCESS';
export const POST_ADMISSION_FORM_DETAILS_FAILURE = 'POST_ADMISSION_FORM_DETAILS_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL ;

export const postAdmissionFormDetailsSlice = (admissionFormData) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: POST_ADMISSION_FORM_DETAILS_REQUEST });

        const { data } = await axios.post(`${API_URL}/Admission/AdmissionFormDetails`, admissionFormData, config);
    

        dispatch({ type: POST_ADMISSION_FORM_DETAILS_SUCCESS, payload: data });

        return { type: POST_ADMISSION_FORM_DETAILS_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: POST_ADMISSION_FORM_DETAILS_FAILURE,
            payload: error.response?.data?.message || error.message,
        });

        return { type: POST_ADMISSION_FORM_DETAILS_FAILURE, payload: error };
    }
};
