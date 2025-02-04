import configHelpers from '../configHelpers';
import axios from "axios";

export const GET_PG_INPATIENT_DISCHARGE_LIST_VERIFIED_REQUEST = 'GET_PG_INPATIENT_DISCHARGE_LIST_VERIFIED_REQUEST';
export const GET_PG_INPATIENT_DISCHARGE_LIST_VERIFIED_SUCCESS = 'GET_PG_INPATIENT_DISCHARGE_LIST_VERIFIED_SUCCESS';
export const GET_PG_INPATIENT_DISCHARGE_LIST_VERIFIED_FAILURE = 'GET_PG_INPATIENT_DISCHARGE_LIST_VERIFIED_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8085';

export const getPgInpatientDischargeListSlice = () => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_PG_INPATIENT_DISCHARGE_LIST_VERIFIED_REQUEST });

        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=PgInpatientDischargeList&isList=true`, config);
    

        dispatch({ type: GET_PG_INPATIENT_DISCHARGE_LIST_VERIFIED_SUCCESS, payload: data });

        return { type: GET_PG_INPATIENT_DISCHARGE_LIST_VERIFIED_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: GET_PG_INPATIENT_DISCHARGE_LIST_VERIFIED_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            },
        });

        return { type: GET_PG_INPATIENT_DISCHARGE_LIST_VERIFIED_FAILURE, payload: error };
    }
};
