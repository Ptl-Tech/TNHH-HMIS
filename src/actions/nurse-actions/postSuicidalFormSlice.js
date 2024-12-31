import configHelpers from '../configHelpers';
import axios from "axios";

export const POST_SUICIDAL_FORM_REQUEST = 'POST_SUICIDAL_FORM_REQUEST';
export const POST_SUICIDAL_FORM_SUCCESS = 'POST_SUICIDAL_FORM_SUCCESS';
export const POST_SUICIDAL_FORM_FAILURE = 'POST_SUICIDAL_FORM_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const postSuicidalFormSlice = (endpoint = '/InpatientForms/SuicidalPrecautionForm', suicidalFormData) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: POST_SUICIDAL_FORM_REQUEST });

        const { data } = await axios.post(`${API_URL}${endpoint}`, suicidalFormData, config);
    

        dispatch({ type: POST_SUICIDAL_FORM_SUCCESS, payload: data });

        return { type: POST_SUICIDAL_FORM_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: POST_SUICIDAL_FORM_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            },
        });

        return { type: POST_SUICIDAL_FORM_FAILURE, payload: error };
    }
};
