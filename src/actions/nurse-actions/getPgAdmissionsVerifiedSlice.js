import configHelpers from '../configHelpers';
import axios from "axios";

export const GET_ADMISSIONS_VERIFIED_REQUEST = 'GET_ADMISSIONS_VERIFIED_REQUEST';
export const GET_ADMISSIONS_VERIFIED_SUCCESS = 'GET_ADMISSIONS_VERIFIED_SUCCESS';
export const GET_ADMISSIONS_VERIFIED_FAILURE = 'GET_ADMISSIONS_VERIFIED_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL ;

export const getPgAdmissionsVerifiedSlice = () => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_ADMISSIONS_VERIFIED_REQUEST });

        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=PgAdmissionsVerified&isList=true`, config);
    

        dispatch({ type: GET_ADMISSIONS_VERIFIED_SUCCESS, payload: data });

        return { type: GET_ADMISSIONS_VERIFIED_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: GET_ADMISSIONS_VERIFIED_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            },
        });

        return { type: GET_ADMISSIONS_VERIFIED_FAILURE, payload: error };
    }
};
