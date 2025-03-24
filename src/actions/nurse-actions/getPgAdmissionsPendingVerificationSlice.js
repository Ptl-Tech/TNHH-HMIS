import configHelpers from '../configHelpers';
import axios from "axios";

export const GET_PG_ADMISSIONS_PENDING_VERIFICATION_REQUEST = 'GET_PG_ADMISSIONS_PENDING_VERIFICATION_REQUEST';
export const GET_PG_ADMISSIONS_PENDING_VERIFICATION_SUCCESS = 'GET_PG_ADMISSIONS_PENDING_VERIFICATION_SUCCESS';
export const GET_PG_ADMISSIONS_PENDING_VERIFICATION_FAILURE = 'GET_PG_ADMISSIONS_PENDING_VERIFICATION_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8085';

export const getPgAdmissionsPendingVerificationSlice = () => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_PG_ADMISSIONS_PENDING_VERIFICATION_REQUEST });

        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=PgNewAdmissionRequests&isList=true`, config);
    

        dispatch({ type: GET_PG_ADMISSIONS_PENDING_VERIFICATION_SUCCESS, payload: data });

        return { type: GET_PG_ADMISSIONS_PENDING_VERIFICATION_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: GET_PG_ADMISSIONS_PENDING_VERIFICATION_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            },
        });

        return { type: GET_PG_ADMISSIONS_PENDING_VERIFICATION_FAILURE, payload: error };
    }
};
