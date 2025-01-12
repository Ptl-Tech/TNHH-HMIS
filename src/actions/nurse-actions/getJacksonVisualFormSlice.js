
import configHelpers from '../configHelpers';
import axios from "axios";

export const GET_JACKSON_VISUAL_FORM_REQUEST = 'GET_JACKSON_VISUAL_FORM_REQUEST';
export const GET_JACKSON_VISUAL_FORM_SUCCESS = 'GET_JACKSON_VISUAL_FORM_SUCCESS';
export const GET_JACKSON_VISUAL_FORM_FAILURE = 'GET_JACKSON_VISUAL_FORM_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const getJacksonVisualFormSlice = () => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_JACKSON_VISUAL_FORM_REQUEST });

        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyIPJacksonVisualList&isList=true`, config);
    

        dispatch({ type: GET_JACKSON_VISUAL_FORM_SUCCESS, payload: data });

        return { type: GET_JACKSON_VISUAL_FORM_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: GET_JACKSON_VISUAL_FORM_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            },
        });

        return { type: GET_JACKSON_VISUAL_FORM_FAILURE, payload: error };
    }
};
