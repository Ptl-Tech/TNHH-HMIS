
import configHelpers  from '../../actions/configHelpers'
import axios from "axios";

export const GET_INJECTIONS_REQUEST = 'GET_INJECTIONS_REQUEST';
export const GET_INJECTIONS_SUCCESS = 'GET_INJECTIONS_NUMBER_SUCCESS';
export const GET_INJECTIONS_FAILURE = 'GET_INJECTIONS_FAILURE';

export const GET_INJECTIONS_LINES_REQUEST = 'GET_INJECTIONS_LINES_REQUEST';
export const GET_INJECTIONS_LINES_SUCCESS = 'GET_INJECTIONS_LINES_SUCCESS';
export const GET_INJECTIONS_LINES_FAILURE = 'GET_INJECTIONS_LINES_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const getInjectionsSlice = (observationNo) => async (dispatch, getState) => {
   
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_INJECTIONS_REQUEST });
        

        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyInjectionsSetup&isList=false&query=$filter=ObservationNo eq '${observationNo}'`, config);

        dispatch({ type: GET_INJECTIONS_SUCCESS, payload: data })

    } catch (error) {
        dispatch({ type: GET_INJECTIONS_FAILURE, payload: error.message });
    }
}


export const getInjectionsLinesSlice = (treatmentNo) => async (dispatch, getState) => {
   
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_INJECTIONS_LINES_REQUEST });
        

        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyTreatmentInjectionLines&isList=false&query=$filter=TreatmentNo eq '${treatmentNo}'`, config);

        dispatch({ type: GET_INJECTIONS_LINES_SUCCESS, payload: data })

    } catch (error) {
        dispatch({ type: GET_INJECTIONS_LINES_FAILURE, payload: error.message });
    }
}