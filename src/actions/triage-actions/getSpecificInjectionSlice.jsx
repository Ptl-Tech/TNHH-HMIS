
import configHelpers  from '../../actions/configHelpers'
import axios from "axios";

export const GET_SPECIFIC_INJECTION_REQUEST = 'GET_SPECIFIC_INJECTION_REQUEST';
export const GET_SPECIFIC_INJECTION_SUCCESS = 'GET_SPECIFIC_INJECTION_SUCCESS';
export const GET_SPECIFIC_INJECTION_FAILURE = 'GET_SPECIFIC_INJECTION_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const getSpecificInjectionSlice = (observationNo) => async (dispatch, getState) => {
   
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_SPECIFIC_INJECTION_REQUEST });
        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyInjectionLines&isList=false&query=$filter=ObservationNo eq '${observationNo}'`, config);

        dispatch({ type: GET_SPECIFIC_INJECTION_SUCCESS, payload: data })

        return data;

    } catch (error) {
        dispatch({ type: GET_SPECIFIC_INJECTION_FAILURE, payload: error.message });
    }
}
