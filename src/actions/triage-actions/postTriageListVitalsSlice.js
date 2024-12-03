
import axios from "axios";
import apiHeaderConfig from "../configHelpers";

export const POST_TRIAGE_LIST_VITALS_REQUEST = "POST_TRIAGE_LIST_VITALS_REQUEST";
export const POST_TRIAGE_LIST_VITALS_SUCCESS = "POST_TRIAGE_LIST_VITALS_SUCCESS";
export const POST_TRIAGE_LIST_VITALS_FAIL = "POST_TRIAGE_LIST_VITALS_FAIL";

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const postTriageListVitalsSlice = (vitals) => async (dispatch, getState) =>{

    try{

        dispatch({ type: POST_TRIAGE_LIST_VITALS_REQUEST });

        const config = apiHeaderConfig(getState);
        const response = await axios.post(`${API_URL}/Triage/Vitals`, 
            vitals,
            config
        );

        dispatch({ type: POST_TRIAGE_LIST_VITALS_SUCCESS, payload: response.data });
        // console.log('logging the response data', response.data);
        return response.data;

    }catch (error) {
        
        dispatch({ type: POST_TRIAGE_LIST_VITALS_FAIL, payload: error });
    
    }
}