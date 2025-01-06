import configHelpers from '../configHelpers';
import axios from "axios";

export const POST_DIETARY_INTAKE_FORM_LINE_REQUEST = 'POST_DIETARY_INTAKE_FORM_LINE_REQUEST';
export const POST_DIETARY_INTAKE_FORM_LINE_SUCCESS = 'POST_DIETARY_INTAKE_FORM_LINE_SUCCESS';
export const POST_DIETARY_INTAKE_FORM_LINE_FAILURE = 'POST_DIETARY_INTAKE_FORM_LINE_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const postDietaryIntakeFormLineSlice = ( formData ) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: POST_DIETARY_INTAKE_FORM_LINE_REQUEST });

        
        const { data } = await axios.post(`${API_URL}/InpatientForms/DietaryIntakeFormLine`, formData, config);

        dispatch({ type: POST_DIETARY_INTAKE_FORM_LINE_SUCCESS, payload: data });

        return { type: POST_DIETARY_INTAKE_FORM_LINE_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: POST_DIETARY_INTAKE_FORM_LINE_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            },
        });

        return { type: POST_DIETARY_INTAKE_FORM_LINE_FAILURE, payload: error };
    }
};
