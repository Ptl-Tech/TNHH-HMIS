
import { message } from 'antd';
import configHelpers  from '../../actions/configHelpers'
import axios from "axios";

export const GET_VITAL_LINES_REQUEST = 'GET_VITAL_LINES_REQUEST';
export const GET_VITAL_LINES_SUCCESS = 'GET_VITAL_LINES_SUCCESS';
export const GET_VITAL_LINES_FAILURE = 'GET_VITAL_LINES_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const getVitalsLinesSlice = (patientNo) => async (dispatch, getState) => {
   
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_VITAL_LINES_REQUEST });
        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyVitalsLines&query=${patientNo}=No eq ‘PTL’&isList=true`, config);


        console.log('response data', data)

        Object.keys(data).length > 0 && dispatch({ type: GET_VITAL_LINES_SUCCESS, payload: data });
        Object.keys(data).length === 0 && (
            dispatch({ type: GET_VITAL_LINES_FAILURE, payload: "Patient not found" }),
            message.warning("No patient found with the provided patient number.", 5)
            );

    } catch (error) {
        dispatch({ type: GET_VITAL_LINES_FAILURE, payload: error.message });
    }
}
