import configHelpers from '../../actions/configHelpers';
import axios from "axios";

export const GET_CONSULTATION_ROOM_LIST_REQUEST = 'GET_CONSULTATION_ROOM_LIST_REQUEST';
export const GET_CONSULTATION_ROOM_LIST_SUCCESS = 'GET_CONSULTATION_ROOM_LIST_SUCCESS';
export const GET_CONSULTATION_ROOM_LIST_FAILURE = 'GET_CONSULTATION_ROOM_LIST_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const getConsultationRoomListSlice = (endpoint = '/data/odatafilter?webservice=QyTreatmentHeaders&isList=true') => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_CONSULTATION_ROOM_LIST_REQUEST });

        const { data } = await axios.get(`${API_URL}${endpoint}`, config);
        
        if (!data || typeof data !== 'object') {
            throw new Error("Invalid response format");
        }

        dispatch({ type: GET_CONSULTATION_ROOM_LIST_SUCCESS, payload: data });
    } catch (error) {
        
        dispatch({
            type: GET_CONSULTATION_ROOM_LIST_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            },
        });
    }
};
