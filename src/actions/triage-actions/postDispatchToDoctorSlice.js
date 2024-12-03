
import axios from "axios";
import apiHeaderConfig from "../configHelpers";

export const POST_DISPATCH_TO_DOCTOR_REQUEST = "POST_DISPATCH_TO_DOCTOR_REQUEST";
export const POST_DISPATCH_TO_DOCTOR_SUCCESS = "POST_DISPATCH_TO_DOCTOR_SUCCESS";
export const POST_DISPATCH_TO_DOCTOR_FAIL = "POST_DISPATCH_TO_DOCTOR_FAIL";

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const postDispatchToDoctorSlice = (dispatchToDoctor) => async (dispatch, getState) =>{

    console.log('patient information', dispatchToDoctor);

    try{

        dispatch({ type: POST_DISPATCH_TO_DOCTOR_REQUEST });

        const config = apiHeaderConfig(getState);
        const response = await axios.post(`${API_URL}/Triage/DispatchToDoctor`, 
            dispatchToDoctor,
            config
        );

        dispatch({ type: POST_DISPATCH_TO_DOCTOR_SUCCESS, payload: response.data });
        console.log('logging the response data', response.data);
        return response.data;

    }catch (error) {
        
        dispatch({ type: POST_DISPATCH_TO_DOCTOR_FAIL, payload: error });
    
    }
}