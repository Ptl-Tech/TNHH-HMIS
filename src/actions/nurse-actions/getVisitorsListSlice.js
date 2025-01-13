import configHelpers from '../configHelpers';
import axios from "axios";

export const GET_VISITORS_LIST_REQUEST = 'GET_VISITORS_LIST_REQUEST';
export const GET_VISITORS_LIST_SUCCESS = 'GET_VISITORS_LIST_SUCCESS';
export const GET_VISITORS_LIST_FAILURE = 'GET_VISITORS_LIST_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const getVisitorsListSlice = () => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_VISITORS_LIST_REQUEST });

        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyIPVisitors&isList=true`, config);
    

        dispatch({ type: GET_VISITORS_LIST_SUCCESS, payload: data });

        return { type: GET_VISITORS_LIST_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: GET_VISITORS_LIST_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            },
        });

        return { type: GET_VISITORS_LIST_FAILURE, payload: error };
    }
};
