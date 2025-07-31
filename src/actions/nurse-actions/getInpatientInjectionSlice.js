import configHelpers from '../../actions/configHelpers';
import axios from "axios";

export const GET_INPATIENT_INJECTION_REQUEST = 'GET_INPATIENT_INJECTION_REQUEST';
export const GET_INPATIENT_INJECTION_SUCCESS = 'GET_INPATIENT_INJECTION_SUCCESS';
export const GET_INPATIENT_INJECTION_FAILURE = 'GET_INPATIENT_INJECTION_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8091';

export const getInpatientInjectionSlice = (endpoint = '/data/odatafilter?webservice=QyInpatientInjections&isList=true') => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_INPATIENT_INJECTION_REQUEST });

        const { data } = await axios.get(`${API_URL}${endpoint}`, config);
        
        if (!data || typeof data !== 'object') {
            throw new Error("Invalid response format");
        }

        dispatch({ type: GET_INPATIENT_INJECTION_SUCCESS, payload: data });
    } catch (error) {
        console.error("Error fetching patient list:", error);

        dispatch({
            type: GET_INPATIENT_INJECTION_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            },
        });
    }
};
