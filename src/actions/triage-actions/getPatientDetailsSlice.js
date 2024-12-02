import axios from "axios";
import apiHeaderConfig from "../configHelpers";
import { message } from "antd";

export const GET_PATIENT_DETAILS_REQUEST = 'GET_PATIENT_DETAILS_REQUEST';
export const GET_PATIENT_DETAILS_SUCCESS = 'GET_PATIENT_DETAILS_SUCCESS';
export const GET_PATIENT_DETAILS_FAILURE = 'GET_PATIENT_DETAILS_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const getPatientDetails = (patientNo) => async (dispatch, getState) => {
    try {
      dispatch({ type: GET_PATIENT_DETAILS_REQUEST });
  
      const config = apiHeaderConfig(getState);
      
      const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyPatients&query=${patientNo}=No eq ‘PTL’&isList=false`, config);

      // Check if a patient was found
      Object.keys(data).length > 0 && dispatch({ type: GET_PATIENT_DETAILS_SUCCESS, payload: data });
      Object.keys(data).length === 0 && (
        dispatch({ type: GET_PATIENT_DETAILS_FAILURE, payload: "Patient not found" }),
        message.warning("No patient found with the provided patient number.", 5)
        );

    } catch (error) {
      dispatch({ type: GET_PATIENT_DETAILS_FAILURE, payload: error.message });
      message.error(error.message, 5);
    }
  };