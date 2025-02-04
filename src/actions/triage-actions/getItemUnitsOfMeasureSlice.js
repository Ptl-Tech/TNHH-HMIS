
import { message } from 'antd';
import configHelpers  from '../../actions/configHelpers'
import axios from "axios";

export const GET_ITEMS_UNITS_OF_MEASURE_REQUEST = 'GET_ITEMS_UNITS_OF_MEASURE_REQUEST';
export const GET_ITEMS_UNITS_OF_MEASURE_SUCCESS = 'GET_ITEMS_UNITS_OF_MEASURE_SUCCESS';
export const GET_ITEMS_UNITS_OF_MEASURE_FAILURE = 'GET_ITEMS_UNITS_OF_MEASURE_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8085';

export const getItemUnitsOfMeasureSlice = () => async (dispatch, getState) => {
   
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_ITEMS_UNITS_OF_MEASURE_REQUEST });
        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyMeasuringUnitsSetup&isList=true`, config);


        dispatch({ type: GET_ITEMS_UNITS_OF_MEASURE_SUCCESS, payload: data })

    } catch (error) {
        dispatch({ type: GET_ITEMS_UNITS_OF_MEASURE_FAILURE, payload: error.message });
    }
}
