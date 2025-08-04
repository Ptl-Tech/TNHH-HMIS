import configHelpers from '../configHelpers';
import axios from "axios";

export const POST_NURSE_ORDER_SHEET_REQUEST = 'POST_NURSE_ORDER_SHEET_REQUEST';
export const POST_NURSE_ORDER_SHEET_SUCCESS = 'POST_NURSE_ORDER_SHEET_SUCCESS';
export const POST_NURSE_ORDER_SHEET_FAILURE = 'POST_NURSE_ORDER_SHEET_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL ;

export const postNurseOrderSheetSlice = (endpoint = '/Nurse/SendOrderToPharmacy', consumablesData) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);

    try {
        dispatch({ type: POST_NURSE_ORDER_SHEET_REQUEST });

        const { data } = await axios.post(`${API_URL}${endpoint}`, consumablesData, config);
    

        dispatch({ type: POST_NURSE_ORDER_SHEET_SUCCESS, payload: data });

        return { type: POST_NURSE_ORDER_SHEET_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: POST_NURSE_ORDER_SHEET_FAILURE,
            payload: error.response?.data?.message || error.message,
        });

        return { type: POST_NURSE_ORDER_SHEET_FAILURE, payload: error };
    }
};
