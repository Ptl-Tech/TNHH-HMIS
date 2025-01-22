
import axios from "axios";
import apiHeaderConfig from "../configHelpers";

export const POST_CHECK_IN_PATIENT_REQUEST = "POST_CHECK_IN_PATIENT_REQUEST";
export const POST_CHECK_IN_PATIENT_SUCCESS = "POST_CHECK_IN_PATIENT_SUCCESS";
export const POST_CHECK_IN_PATIENT_FAIL = "POST_CHECK_IN_PATIENT_FAIL";

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const postCheckInPatient = (treatmentNo) => async (dispatch, getState) =>{

    try{

        dispatch({ type: POST_CHECK_IN_PATIENT_REQUEST });

        const config = apiHeaderConfig(getState);
        const response = await axios.post(`${API_URL}/Doctor/ConsultationRoomCheckin`, 
         {
            treatmentNo: treatmentNo
         },
            config
        );

        dispatch({ type: POST_CHECK_IN_PATIENT_SUCCESS, payload: response.data });

        return response.data;

    }catch (error) {
        
        dispatch({ type: POST_CHECK_IN_PATIENT_FAIL, payload: error });
    
    }
}