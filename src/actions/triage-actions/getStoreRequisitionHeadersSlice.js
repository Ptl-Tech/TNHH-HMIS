
import { message } from 'antd';
import configHelpers  from '../../actions/configHelpers'
import axios from "axios";

export const GET_STORE_REQUISITION_HEADERS_REQUEST = 'GET_STORE_REQUISITION_HEADERS_REQUEST';
export const GET_STORE_REQUISITION_HEADERS_SUCCESS = 'GET_STORE_REQUISITION_HEADERS_SUCCESS';
export const GET_STORE_REQUISITION_HEADERS_FAILURE = 'GET_STORE_REQUISITION_HEADERS_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8091';

export const getStoreRequisitionHeadersSlice = () => async (dispatch, getState) => {
   
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_STORE_REQUISITION_HEADERS_REQUEST });
        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyStoreRequisitionHeaders&isList=true`, config);


        dispatch({ type: GET_STORE_REQUISITION_HEADERS_SUCCESS, payload: data })

    } catch (error) {
        dispatch({ type: GET_STORE_REQUISITION_HEADERS_FAILURE, payload: error.message });
    }
}
