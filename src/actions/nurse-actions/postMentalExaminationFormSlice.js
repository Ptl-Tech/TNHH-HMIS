import configHelpers from '../configHelpers';
import axios from "axios";

export const POST_MENTAL_EXAMINATION_FORM_REQUEST = 'POST_MENTAL_EXAMINATION_FORM_REQUEST';
export const POST_MENTAL_EXAMINATION_FORM_SUCCESS = 'POST_MENTAL_EXAMINATION_FORM_SUCCESS';
export const POST_MENTAL_EXAMINATION_FORM_FAILURE = 'POST_MENTAL_EXAMINATION_FORM_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8085';

export const postMentalExaminationFormSlice = (endpoint = '/InpatientForms/MentalStatusCheckForm', mentalStatusData) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);

    try {
        dispatch({ type: POST_MENTAL_EXAMINATION_FORM_REQUEST });

        const { data } = await axios.post(`${API_URL}${endpoint}`, mentalStatusData, config);
    

        dispatch({ type: POST_MENTAL_EXAMINATION_FORM_SUCCESS, payload: data });

        return { type: POST_MENTAL_EXAMINATION_FORM_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: POST_MENTAL_EXAMINATION_FORM_FAILURE,
            payload: error.response?.data?.message || error.message,
        });

        return { type: POST_MENTAL_EXAMINATION_FORM_FAILURE, payload: error };
    }
};
