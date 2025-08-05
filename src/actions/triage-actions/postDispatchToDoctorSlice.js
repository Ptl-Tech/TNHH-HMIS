
import axios from "axios";
import apiHeaderConfig from "../configHelpers";

export const POST_DISPATCH_TO_DOCTOR_REQUEST = "POST_DISPATCH_TO_DOCTOR_REQUEST";
export const POST_DISPATCH_TO_DOCTOR_SUCCESS = "POST_DISPATCH_TO_DOCTOR_SUCCESS";
export const POST_DISPATCH_TO_DOCTOR_FAIL = "POST_DISPATCH_TO_DOCTOR_FAIL";

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL ;

export const postDispatchToDoctorSlice = (dispatchToDoctor) => async (dispatch, getState) =>{

    try{

        dispatch({ type: POST_DISPATCH_TO_DOCTOR_REQUEST });

        const config = apiHeaderConfig(getState);
        const {data} = await axios.post(`${API_URL}/Triage/DispatchToDoctor`, 
            dispatchToDoctor,
            config
        );

        console.log('data from the API', data);

        dispatch({ type: POST_DISPATCH_TO_DOCTOR_SUCCESS, payload: data });
 
        return { type: POST_DISPATCH_TO_DOCTOR_SUCCESS, payload: data };

    }catch (error) {
        
        dispatch({ 
            type: POST_DISPATCH_TO_DOCTOR_FAIL, 
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            }
        });
    
    }
}