import { message } from 'antd';
import configHelpers from '../configHelpers';
import axios from "axios";

export const POST_DAILY_PROCEDURE_OR_PROCESS_REQUEST = 'POST_DAILY_PROCEDURE_OR_PROCESS_REQUEST';
export const POST_DAILY_PROCEDURE_OR_PROCESS_SUCCESS = 'POST_DAILY_PROCEDURE_OR_PROCESS_SUCCESS';
export const POST_DAILY_PROCEDURE_OR_PROCESS_FAILURE = 'POST_DAILY_PROCEDURE_OR_PROCESS_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8091';

export const postDailyProcedureOrProcessSlice = ( formData ) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: POST_DAILY_PROCEDURE_OR_PROCESS_REQUEST });

        
        const { data } = await axios.post(`${API_URL}/Doctor/DoctorTreatmentNotes`, formData, config);

        dispatch({ type: POST_DAILY_PROCEDURE_OR_PROCESS_SUCCESS, payload: data });

        return { type: POST_DAILY_PROCEDURE_OR_PROCESS_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: POST_DAILY_PROCEDURE_OR_PROCESS_FAILURE,
            payload: error.response?.data?.message || error.message,
        });

        message.error(error.message, 5);
    }
};
