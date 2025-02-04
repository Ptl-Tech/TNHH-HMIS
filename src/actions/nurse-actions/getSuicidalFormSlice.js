import configHelpers from '../configHelpers';
import axios from "axios";

export const GET_SUICIDAL_FORM_REQUEST = 'GET_SUICIDAL_FORM_REQUEST';
export const GET_SUICIDAL_FORM_SUCCESS = 'GET_SUICIDAL_FORM_SUCCESS';
export const GET_SUICIDAL_FORM_FAILURE = 'GET_SUICIDAL_FORM_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8085';

export const getSuicidalFormSlice = () => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_SUICIDAL_FORM_REQUEST });

        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyIPSuicidalPrecautions&isList=true`, config);
    

        dispatch({ type: GET_SUICIDAL_FORM_SUCCESS, payload: data });

        return { type: GET_SUICIDAL_FORM_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: GET_SUICIDAL_FORM_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            },
        });

        return { type: GET_SUICIDAL_FORM_FAILURE, payload: error };
    }
};
