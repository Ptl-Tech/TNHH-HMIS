import configHelpers from '../configHelpers';
import axios from "axios";

export const POST_JACKSON_VISUAL_FORM_REQUEST = 'POST_JACKSON_VISUAL_FORM_REQUEST';
export const POST_JACKSON_VISUAL_FORM_SUCCESS = 'POST_JACKSON_VISUAL_FORM_SUCCESS';
export const POST_JACKSON_VISUAL_FORM_FAILURE = 'POST_JACKSON_VISUAL_FORM_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const postJacksonVisualFormSlice = (endpoint = '/InpatientForms/JacksonVisualForm', jacksonData) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: POST_JACKSON_VISUAL_FORM_REQUEST });

        const { data } = await axios.post(`${API_URL}${endpoint}`, jacksonData, config);
    

        dispatch({ type: POST_JACKSON_VISUAL_FORM_SUCCESS, payload: data });

        return { type: POST_JACKSON_VISUAL_FORM_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: POST_JACKSON_VISUAL_FORM_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            },
        });

        return { type: POST_JACKSON_VISUAL_FORM_FAILURE, payload: error };
    }
};
