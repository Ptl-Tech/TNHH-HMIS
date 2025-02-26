import configHelpers from '../configHelpers';
import axios from "axios";

export const POST_INITIATE_DISCHARGE_REQUEST = 'POST_INITIATE_DISCHARGE_REQUEST';
export const POST_INITIATE_DISCHARGE_SUCCESS = 'POST_INITIATE_DISCHARGE_SUCCESS';
export const POST_INITIATE_DISCHARGE_FAILURE = 'POST_INITIATE_DISCHARGE_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8085';

export const postInitiateDischargeSlice = (endpoint = '/Inpatient/InitiateDischarge', initiateDischargeData) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: POST_INITIATE_DISCHARGE_REQUEST });

        console.log('initiateDischargeData', initiateDischargeData);

        const { data } = await axios.post(`${API_URL}${endpoint}`, initiateDischargeData, config);
    

        dispatch({ type: POST_INITIATE_DISCHARGE_SUCCESS, payload: data });

        return { type: POST_INITIATE_DISCHARGE_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: POST_INITIATE_DISCHARGE_FAILURE,
            payload: error.response?.data?.message || error.message,
        });

        return { type: POST_INITIATE_DISCHARGE_FAILURE, payload: error };
    }
};
