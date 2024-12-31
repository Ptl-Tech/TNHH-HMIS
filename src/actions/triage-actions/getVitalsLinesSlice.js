
import configHelpers  from '../../actions/configHelpers'
import axios from "axios";

export const GET_VITAL_LINES_REQUEST = 'GET_VITAL_LINES_REQUEST';
export const GET_VITAL_LINES_SUCCESS = 'GET_VITAL_LINES_SUCCESS';
export const GET_VITAL_LINES_FAILURE = 'GET_VITAL_LINES_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const getVitalsLinesSlice = (observationNo) => async (dispatch, getState) => {
   
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_VITAL_LINES_REQUEST });
        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyVitalsLines&isList=false&query=$filter=ObservationNo eq '${observationNo}'`, config);

        dispatch({ type: GET_VITAL_LINES_SUCCESS, payload: data })

        return data;

    } catch (error) {
        dispatch({ type: GET_VITAL_LINES_FAILURE, payload: error.message });
    }
}
