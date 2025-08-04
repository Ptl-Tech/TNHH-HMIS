
import axios from "axios";
import apiHeaderConfig from "../configHelpers";

export const POST_MARK_AS_COMPLETED_REQUEST = "POST_MARK_AS_COMPLETED_REQUEST";
export const POST_MARK_AS_COMPLETED_SUCCESS = "POST_MARK_AS_COMPLETED_SUCCESS";
export const POST_MARK_AS_COMPLETED_FAIL = "POST_MARK_AS_COMPLETED_FAIL";

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL ;

export const postMarkasCompleted = (treatmentNo) => async (dispatch, getState) =>{

    try{

        dispatch({ type: POST_MARK_AS_COMPLETED_REQUEST });

        const config = apiHeaderConfig(getState);
        const response = await axios.post(`${API_URL}/Doctor/ConsultationMarkAsCompleted`, 
         {
            treatmentNo: treatmentNo
         },
            config
        );

        dispatch({ type: POST_MARK_AS_COMPLETED_SUCCESS, payload: response.data });

        return response.data;

    }catch (error) {
        
        dispatch({ type: POST_MARK_AS_COMPLETED_FAIL, payload: error });
    
    }
}