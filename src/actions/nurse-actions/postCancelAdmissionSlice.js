import { message } from 'antd';
import configHelpers from '../configHelpers';
import axios from "axios";

export const POST_CANCEL_ADMISSION_REQUEST = 'POST_CANCEL_ADMISSION_REQUEST';
export const POST_CANCEL_ADMISSION_SUCCESS = 'POST_CANCEL_ADMISSION_SUCCESS';
export const POST_CANCEL_ADMISSION_FAILURE = 'POST_CANCEL_ADMISSION_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const postCancelAdmissionSlice = (cancelAdmissionData) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: POST_CANCEL_ADMISSION_REQUEST });

        const { data } = await axios.post(`${API_URL}/Admission/CancelAdmission`, cancelAdmissionData, config);
    

        dispatch({ type: POST_CANCEL_ADMISSION_SUCCESS, payload: data });

        return { type: POST_CANCEL_ADMISSION_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: POST_CANCEL_ADMISSION_FAILURE,
            payload: error.response?.data?.message || error.message,
        });

        message.error(error.message, 5);
    }
};
