
import configHelpers  from '../../actions/configHelpers'
import axios from "axios";

export const GET_DRESSING_REQUEST = 'GET_DRESSING_REQUEST';
export const GET_DRESSING_SUCCESS = 'GET_DRESSING_SUCCESS';
export const GET_DRESSING_FAILURE = 'GET_DRESSING_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8091';

export const getDressingSlice = (observationNo) => async (dispatch, getState) => {
   
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_DRESSING_REQUEST });
        
        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyTriageDressings&isList=true&query=$filter=ObservationNo eq '${observationNo}'`, config);

        dispatch({ type: GET_DRESSING_SUCCESS, payload: data })

    } catch (error) {
        dispatch({ type: GET_DRESSING_FAILURE, payload: error.message });
    }
}
