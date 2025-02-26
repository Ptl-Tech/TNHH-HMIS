import configHelpers from '../configHelpers';
import axios from "axios";

export const GET_NURSE_ADMISSION_NOTES_REQUEST = 'GET_NURSE_ADMISSION_NOTES_REQUEST';
export const GET_NURSE_ADMISSION_NOTES_SUCCESS = 'GET_NURSE_ADMISSION_NOTES_SUCCESS';
export const GET_NURSE_ADMISSION_NOTES_FAILURE = 'GET_NURSE_ADMISSION_NOTES_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8085';

export const getNurseAdmissionNotesSlice = () => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_NURSE_ADMISSION_NOTES_REQUEST });

        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyAdmissionNurseNotes&isList=true`, config);
    

        dispatch({ type: GET_NURSE_ADMISSION_NOTES_SUCCESS, payload: data });

        return { type: GET_NURSE_ADMISSION_NOTES_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: GET_NURSE_ADMISSION_NOTES_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            },
        });

        return { type: GET_NURSE_ADMISSION_NOTES_FAILURE, payload: error };
    }
};
