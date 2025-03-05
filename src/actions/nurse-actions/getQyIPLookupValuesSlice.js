import configHelpers from '../configHelpers';
import axios from "axios";

export const GET_QY_IP_LOOKUP_VALUES_REQUEST = 'GET_QY_IP_LOOKUP_VALUES_REQUEST';
export const GET_QY_IP_LOOKUP_VALUES_SUCCESS = 'GET_QY_IP_LOOKUP_VALUES_SUCCESS';
export const GET_QY_IP_LOOKUP_VALUES_FAILURE = 'GET_QY_IP_LOOKUP_VALUES_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8085';

export const getQyIpLookupValuesSlice = (type) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_QY_IP_LOOKUP_VALUES_REQUEST });

        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyIPFormLookupValues&isList=true&query=$filter=Type eq '${type}'`, config);
    

        dispatch({ type: GET_QY_IP_LOOKUP_VALUES_SUCCESS, payload: data });

        return { type: GET_QY_IP_LOOKUP_VALUES_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: GET_QY_IP_LOOKUP_VALUES_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            },
        });

        return { type: GET_QY_IP_LOOKUP_VALUES_FAILURE, payload: error };
    }
};
