import configHelpers from '../configHelpers';
import axios from "axios";

export const GET_PG_INPATIENT_DISCHARGE_REQUEST_REQUEST = 'GET_PG_INPATIENT_DISCHARGE_REQUEST_REQUEST';
export const GET_PG_INPATIENT_DISCHARGE_REQUEST_SUCCESS = 'GET_PG_INPATIENT_DISCHARGE_REQUEST_SUCCESS';
export const GET_PG_INPATIENT_DISCHARGE_REQUEST_FAILURE = 'GET_PG_INPATIENT_DISCHARGE_REQUEST_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8091';

export const getPgInpatientDischargeRequestsSlice = () => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_PG_INPATIENT_DISCHARGE_REQUEST_REQUEST });

        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=PgInpatientDischargeRequests&isList=true`, config);
    

        dispatch({ type: GET_PG_INPATIENT_DISCHARGE_REQUEST_SUCCESS, payload: data });

        return { type: GET_PG_INPATIENT_DISCHARGE_REQUEST_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: GET_PG_INPATIENT_DISCHARGE_REQUEST_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            },
        });

        return { type: GET_PG_INPATIENT_DISCHARGE_REQUEST_FAILURE, payload: error };
    }
};
