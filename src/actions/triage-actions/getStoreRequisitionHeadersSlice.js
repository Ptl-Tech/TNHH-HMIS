
import { message } from 'antd';
import configHelpers  from '../../actions/configHelpers'
import axios from "axios";

export const GET_STORE_REQUISITION_HEADERS_REQUEST = 'GET_STORE_REQUISITION_HEADERS_REQUEST';
export const GET_STORE_REQUISITION_HEADERS_SUCCESS = 'GET_STORE_REQUISITION_HEADERS_SUCCESS';
export const GET_STORE_REQUISITION_HEADERS_FAILURE = 'GET_STORE_REQUISITION_HEADERS_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const getStoreRequisitionHeadersSlice = () => async (dispatch, getState) => {
   
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_STORE_REQUISITION_HEADERS_REQUEST });
        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyStoreRequisitionHeaders&isList=true`, config);


        console.log('response data', data)

        Object.keys(data).length > 0 && dispatch({ type: GET_STORE_REQUISITION_HEADERS_SUCCESS, payload: data });
        Object.keys(data).length === 0 && (
            dispatch({ type: GET_STORE_REQUISITION_HEADERS_FAILURE, payload: "Nothing found" }),
            message.warning("No requisition headers found.", 5)
            );

    } catch (error) {
        dispatch({ type: GET_STORE_REQUISITION_HEADERS_FAILURE, payload: error.message });
    }
}
