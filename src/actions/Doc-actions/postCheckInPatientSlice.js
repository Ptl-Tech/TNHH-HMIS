
import axios from "axios";
import apiHeaderConfig from "../configHelpers";

export const CONSULTATION_ROOM_CHECK_IN_PATIENT_REQUEST = "CONSULTATION_ROOM_CHECK_IN_PATIENT_REQUEST";
export const CONSULTATION_ROOM_CHECK_IN_PATIENT_SUCCESS = "CONSULTATION_ROOM_CHECK_IN_PATIENT_SUCCESS";
export const CONSULTATION_ROOM_CHECK_IN_PATIENT_FAIL = "CONSULTATION_ROOM_CHECK_IN_PATIENT_FAIL";

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const postCheckInPatientSlice = (observationNo) => async (dispatch, getState) =>{

    try{

        dispatch({ type: CONSULTATION_ROOM_CHECK_IN_PATIENT_REQUEST });

        const config = apiHeaderConfig(getState);
        const response = await axios.post(`${API_URL}/Consultation/CheckinPatient`, 
            observationNo,
            config
        );

        dispatch({ type: CONSULTATION_ROOM_CHECK_IN_PATIENT_SUCCESS, payload: response.data });

        return response.data;

    }catch (error) {
        
        dispatch({ type: CONSULTATION_ROOM_CHECK_IN_PATIENT_FAIL, payload: error });
    
    }
}