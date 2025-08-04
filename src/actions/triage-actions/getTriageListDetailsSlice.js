import axios from "axios";
import apiHeaderConfig from "../configHelpers";
import { message } from "antd";
export const GET_TRIAGE_LIST_DETAILS_REQUEST = 'GET_TRIAGE_LIST_DETAILS_REQUEST';
export const GET_TRIAGE_LIST_DETAILS_SUCCESS = 'GET_TRIAGE_LIST_DETAILS_SUCCESS';
export const GET_TRIAGE_LIST_DETAILS_FAILURE = 'GET_TRIAGE_LIST_DETAILS_FAILURE';
const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL ;

export const getTriageListDetails = (patientNo) => async (dispatch, getState) => {
    try {
      dispatch({ type: GET_TRIAGE_LIST_DETAILS_REQUEST });
  
      const config = apiHeaderConfig(getState);
      
      const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyTriageList&query=${patientNo}=No eq ‘PTL’&isList=false`, config);

      // Check if a patient was found
     
        dispatch({ type: GET_TRIAGE_LIST_DETAILS_SUCCESS, payload: data })

    } catch (error) {
      dispatch({ type: GET_TRIAGE_LIST_DETAILS_FAILURE, payload: error.message });
      message.error(error.message, 5);
    }
  };