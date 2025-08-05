import configHelpers from '../configHelpers';
import axios from "axios";

export const POST_NURSE_ADMISSION_NOTES_REQUEST = 'POST_NURSE_ADMISSION_NOTES_REQUEST';
export const POST_NURSE_ADMISSION_NOTES_SUCCESS = 'POST_NURSE_ADMISSION_NOTES_SUCCESS';
export const POST_NURSE_ADMISSION_NOTES_FAILURE = 'POST_NURSE_ADMISSION_NOTES_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL ;

export const postNurseAdmissionNotesSlice = (endpoint = '/Nurse/NurseAdmissionNotes', visitorData) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: POST_NURSE_ADMISSION_NOTES_REQUEST });

        const { data } = await axios.post(`${API_URL}${endpoint}`, visitorData, config);
    

        dispatch({ type: POST_NURSE_ADMISSION_NOTES_SUCCESS, payload: data });

        return { type: POST_NURSE_ADMISSION_NOTES_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: POST_NURSE_ADMISSION_NOTES_FAILURE,
            payload: error.response?.data?.message || error.message,
        });

        return { type: POST_NURSE_ADMISSION_NOTES_FAILURE, payload: error };
    }
};
