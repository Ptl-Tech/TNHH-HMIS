import configHelpers from '../configHelpers';
import axios from "axios";

export const GET_PG_BEDS_REQUEST = 'GET_PG_BEDS_REQUEST';
export const GET_PG_BEDS_SUCCESS = 'GET_PG_BEDS_SUCCESS';
export const GET_PG_BEDS_FAILURE = 'GET_PG_BEDS_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8085';

export const getPgBedsSlice = () => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_PG_BEDS_REQUEST });

        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=PgBeds&isList=true`, config);
    

        dispatch({ type: GET_PG_BEDS_SUCCESS, payload: data });

        return { type: GET_PG_BEDS_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: GET_PG_BEDS_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            },
        });

        return { type: GET_PG_BEDS_FAILURE, payload: error };
    }
};
