import configHelpers from '../configHelpers';
import axios from "axios";

export const GET_QY_IP_DIETARY_FORM_REQUEST = 'GET_QY_IP_DIETARY_FORM_REQUEST';
export const GET_QY_IP_DIETARY_FORM_SUCCESS = 'GET_QY_IP_DIETARY_FORM_SUCCESS';
export const GET_QY_IP_DIETARY_FORM_FAILURE = 'GET_QY_IP_DIETARY_FORM_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8091';

export const getQyDietaryFormLinesSlice = (admissionNo) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_QY_IP_DIETARY_FORM_REQUEST });

        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyIPDietaryFormLines&isList=true &query=$filter=AdmissionNo eq '${admissionNo}'`, config);
    

        dispatch({ type: GET_QY_IP_DIETARY_FORM_SUCCESS, payload: data });

        return { type: GET_QY_IP_DIETARY_FORM_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: GET_QY_IP_DIETARY_FORM_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            },
        });

        return { type: GET_QY_IP_DIETARY_FORM_FAILURE, payload: error };
    }
};
