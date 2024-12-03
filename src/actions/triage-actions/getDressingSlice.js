
import { message } from 'antd';
import configHelpers  from '../../actions/configHelpers'
import axios from "axios";

export const GET_DRESSING_REQUEST = 'GET_DRESSING_REQUEST';
export const GET_DRESSING_SUCCESS = 'GET_DRESSING_SUCCESS';
export const GET_DRESSING_FAILURE = 'GET_DRESSING_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const getDressingSlice = (observationNo) => async (dispatch, getState) => {
   
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_DRESSING_REQUEST });
        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyVitalsLines&query=${observationNo}=No eq ‘PTL’&isList=false`, config);


        console.log('response data', data)

        Object.keys(data).length > 0 && dispatch({ type: GET_DRESSING_SUCCESS, payload: data });
        Object.keys(data).length === 0 && (
            dispatch({ type: GET_DRESSING_FAILURE, payload: "Nothing found" }),
            message.warning("No dressing found.", 5)
            );

    } catch (error) {
        dispatch({ type: GET_DRESSING_FAILURE, payload: error.message });
    }
}
