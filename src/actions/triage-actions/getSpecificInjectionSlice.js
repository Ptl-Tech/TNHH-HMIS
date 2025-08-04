
import configHelpers  from '../configHelpers'
import axios from "axios";

export const GET_SPECIFIC_INJECTION_REQUEST = 'GET_SPECIFIC_INJECTION_REQUEST';
export const GET_SPECIFIC_INJECTION_SUCCESS = 'GET_SPECIFIC_INJECTION_SUCCESS';
export const GET_SPECIFIC_INJECTION_FAILURE = 'GET_SPECIFIC_INJECTION_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8091';

export const getSpecificInjectionSlice = () => async (dispatch, getState) => {
   
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_SPECIFIC_INJECTION_REQUEST });
        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyInjectionLines&isList=true`, config);

        dispatch({ type: GET_SPECIFIC_INJECTION_SUCCESS, payload: data })

        return data;

    } catch (error) {
        dispatch({ type: GET_SPECIFIC_INJECTION_FAILURE, payload: error.message });
    }
}
