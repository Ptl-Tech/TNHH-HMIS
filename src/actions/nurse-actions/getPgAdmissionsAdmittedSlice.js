import configHelpers from '../configHelpers';
import axios from "axios";

export const GET_PG_ADMISSIONS_ADMITTED_REQUEST = 'GET_PG_ADMISSIONS_ADMITTED_REQUEST';
export const GET_PG_ADMISSIONS_ADMITTED_SUCCESS = 'GET_PG_ADMISSIONS_ADMITTED_SUCCESS';
export const GET_PG_ADMISSIONS_ADMITTED_FAILURE = 'GET_PG_ADMISSIONS_ADMITTED_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const getPgAdmissionsAdmittedSlice = () => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_PG_ADMISSIONS_ADMITTED_REQUEST });

        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=PgAdmissionsAdmitted&isList=true`, config);

        dispatch({ type: GET_PG_ADMISSIONS_ADMITTED_SUCCESS, payload: data });

        return { type: GET_PG_ADMISSIONS_ADMITTED_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: GET_PG_ADMISSIONS_ADMITTED_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            },
        });

        return { type: GET_PG_ADMISSIONS_ADMITTED_FAILURE, payload: error };
    }
};
