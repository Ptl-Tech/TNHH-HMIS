
import { message } from 'antd';
import configHelpers  from '../../actions/configHelpers'
import axios from "axios";

export const GET_ITEMS_REQUEST = 'GET_ITEMS_REQUEST';
export const GET_ITEMS_SUCCESS = 'GET_ITEMS_SUCCESS';
export const GET_ITEMS_FAILURE = 'GET_ITEMS_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const getItemsSlice = () => async (dispatch, getState) => {
   
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_ITEMS_REQUEST });
        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyItems&isList=true`, config);

        dispatch({ type: GET_ITEMS_SUCCESS, payload: data });
     
    } catch (error) {
        dispatch({ type: GET_ITEMS_FAILURE, payload: error.message });
    }
}
