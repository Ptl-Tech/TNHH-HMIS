
import axios from "axios";
import apiHeaderConfig from "../configHelpers";

export const POST_INJECTIONS_REQUEST = "POST_INJECTIONS_REQUEST";
export const POST_INJECTIONS_SUCCESS = "POST_INJECTIONS_SUCCESS";
export const POST_INJECTIONS_FAIL = "POST_INJECTIONS_FAIL";

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8085';

export const postInjectionsSlice = (injections) => async (dispatch, getState) =>{

    try{

        dispatch({ type: POST_INJECTIONS_REQUEST });

        const config = apiHeaderConfig(getState);
        const response = await axios.post(`${API_URL}/Triage/Injections`, 
            injections,
            config
        );

        dispatch({ type: POST_INJECTIONS_SUCCESS, payload: response.data });

        console.log('post response', response.data)
       
        return response.data;

    }catch (error) {
        
        dispatch({ type: POST_INJECTIONS_FAIL, payload: error });
    
    }
}