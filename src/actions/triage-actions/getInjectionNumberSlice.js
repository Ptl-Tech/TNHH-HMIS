
import configHelpers  from '../../actions/configHelpers'
import axios from "axios";

export const GET_INJECTIONS_NUMBER_REQUEST = 'GET_INJECTIONS_NUMBER_REQUEST';
export const GET_INJECTIONS_NUMBER_SUCCESS = 'GET_INJECTIONS_NUMBER_SUCCESS';
export const GET_INJECTIONS_NUMBER_FAILURE = 'GET_INJECTIONS_NUMBER_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const getInjectionNumberSlice = () => async (dispatch, getState) => {
   
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_INJECTIONS_NUMBER_REQUEST });
        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyInjectionsSetup&isList=true`, config);
      
        dispatch({ type: GET_INJECTIONS_NUMBER_SUCCESS, payload: data })
          

    } catch (error) {
        dispatch({ type: GET_INJECTIONS_NUMBER_FAILURE, payload: error.message });
    }
}
