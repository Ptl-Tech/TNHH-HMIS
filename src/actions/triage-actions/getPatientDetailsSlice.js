import axios from "axios";
import apiHeaderConfig from "../configHelpers";
import { message } from "antd";
const API_URL =  'https://chiromo.potestastechnologies.net:8091';

export const GET_PATIENT_DETAILS_REQUEST = 'GET_PATIENT_DETAILS_REQUEST';
export const GET_PATIENT_DETAILS_SUCCESS = 'GET_PATIENT_DETAILS_SUCCESS';
export const GET_PATIENT_DETAILS_FAILURE = 'GET_PATIENT_DETAILS_FAILURE';


export const getPatientDetails = (patientNo) => async (dispatch, getState) => {
    try {
      dispatch({ type: GET_PATIENT_DETAILS_REQUEST });
   
      const config = apiHeaderConfig(getState);
      
      const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=PgPatientsList&isList=false&query=$filter=PatientNo eq '${patientNo}'`, config);

      // Check if a patient was found
     
        dispatch({ type: GET_PATIENT_DETAILS_SUCCESS, payload: data })

    } catch (error) {
      dispatch({ type: GET_PATIENT_DETAILS_FAILURE, payload: error.message });
      message.error(error.message, 5);
    }
  };