
import axios from "axios";
import apiHeaderConfig from "../configHelpers";

export const POST_DRESSINGS_REQUEST = "POST_DRESSINGS_REQUEST";
export const POST_DRESSINGS_SUCCESS = "POST_DRESSINGS_SUCCESS";
export const POST_DRESSINGS_FAIL = "POST_DRESSINGS_FAIL";

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8091';

export const postDressingsSlice = (injections) => async (dispatch, getState) =>{

    try{

        dispatch({ type: POST_DRESSINGS_REQUEST });

        const config = apiHeaderConfig(getState);
        const response = await axios.post(`${API_URL}/Triage/Dressings`, 
            injections,
            config
        );

        dispatch({ type: POST_DRESSINGS_SUCCESS, payload: response.data });
        
        return response.data;

    }catch (error) {
        
        dispatch({ type: POST_DRESSINGS_FAIL, payload: error });
    
    }
}