import configHelpers from '../configHelpers';
import axios from "axios";

export const POST_VISITOR_LIST_REQUEST = 'POST_VISITOR_LIST_REQUEST';
export const POST_VISITOR_LIST_SUCCESS = 'POST_VISITOR_LIST_SUCCESS';
export const POST_VISITOR_LIST_FAILURE = 'POST_VISITOR_LIST_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL ;

export const postVisitorListSlice = (endpoint = '/InpatientForms/VisitorsListForm', visitorData) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: POST_VISITOR_LIST_REQUEST });

        const { data } = await axios.post(`${API_URL}${endpoint}`, visitorData, config);
    

        dispatch({ type: POST_VISITOR_LIST_SUCCESS, payload: data });

        return { type: POST_VISITOR_LIST_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: POST_VISITOR_LIST_FAILURE,
            payload: error.response?.data?.message || error.message,
        });

        return { type: POST_VISITOR_LIST_FAILURE, payload: error };
    }
};
