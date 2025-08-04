import configHelpers from '../configHelpers';
import axios from "axios";

export const GET_QY_URGENCY_COLOR_CODING_REQUEST = 'GET_QY_URGENCY_COLOR_CODING_REQUEST';
export const GET_QY_URGENCY_COLOR_CODING_SUCCESS = 'GET_QY_URGENCY_COLOR_CODING_SUCCESS';
export const GET_QY_URGENCY_COLOR_CODING_FAILURE = 'GET_QY_URGENCY_COLOR_CODING_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL ;

export const getQyUrgencyColorCodingSetupSetupSlice = () => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_QY_URGENCY_COLOR_CODING_REQUEST });

        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyUrgencyColorCodingSetup&isList=true`, config);
    

        dispatch({ type: GET_QY_URGENCY_COLOR_CODING_SUCCESS, payload: data });

        return { type: GET_QY_URGENCY_COLOR_CODING_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: GET_QY_URGENCY_COLOR_CODING_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            },
        });

        return { type: GET_QY_URGENCY_COLOR_CODING_FAILURE, payload: error };
    }
};
