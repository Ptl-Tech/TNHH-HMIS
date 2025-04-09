import { message } from 'antd';
import configHelpers from '../../actions/configHelpers';
import axios from "axios";

export const GET_CONSULTATION_ROOM_LIST_REQUEST = 'GET_CONSULTATION_ROOM_LIST_REQUEST';
export const GET_CONSULTATION_ROOM_LIST_SUCCESS = 'GET_CONSULTATION_ROOM_LIST_SUCCESS';
export const GET_CONSULTATION_ROOM_LIST_FAILURE = 'GET_CONSULTATION_ROOM_LIST_FAILURE';

export const GET_CONSULTATION_ROOM_DETAILS_REQUEST = 'GET_CONSULTATION_ROOM_DETAILS_REQUEST';
export const GET_CONSULTATION_ROOM_DETAILS_SUCCESS = 'GET_CONSULTATION_ROOM_DETAILS_SUCCESS';
export const GET_CONSULTATION_ROOM_DETAILS_FAILURE = 'GET_CONSULTATION_ROOM_DETAILS_FAILURE';

export const GET_CONSULTATION_REQUEST = 'GET_CONSULTATION_REQUEST';
export const GET_CONSULTATION_SUCCESS = 'GET_CONSULTATION_SUCCESS';
export const GET_CONSULTATION_FAILURE = 'GET_CONSULTATION_FAILURE';


const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8085';

export const getConsultationRoomListSlice = (endpoint = '/data/odatafilter?webservice=QyTreatmentHeaders&isList=true') => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_CONSULTATION_ROOM_LIST_REQUEST });

        const { data } = await axios.get(`${API_URL}${endpoint}`, config);
        
        if (!data || typeof data !== 'object') {
            throw new Error("Invalid response format");
        }

        dispatch({ type: GET_CONSULTATION_ROOM_LIST_SUCCESS, payload: data });
    } catch (error) {
        
        dispatch({
            type: GET_CONSULTATION_ROOM_LIST_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            },
        });
    }
};

export const getSingleConsultationSlice = (EncounterNo) => async(dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_CONSULTATION_ROOM_DETAILS_REQUEST });    
        // Perform the API request
        const response = await axios.get(
          `${API_URL}/data/odatafilter?webservice=QyTreatmentHeaders&isList=true&query=$filter=TreatmentNo eq '${EncounterNo}'`,
          config
        );
        // console.log(response.data);
    
        dispatch({ type: GET_CONSULTATION_ROOM_DETAILS_SUCCESS, payload: response.data });
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || error.message || "Failed to fetch Encounter Details";
    
        // Display error notification
        message.error(errorMessage);
    
        dispatch({ type: GET_CONSULTATION_ROOM_DETAILS_FAILURE, payload: errorMessage });
      }
}

// get consultation with patientNo
export const getConsultationSlice = (patientNo, status) => async(dispatch, getState) => {
  const config = configHelpers(getState);
  try {
      dispatch({ type: GET_CONSULTATION_REQUEST });    
      // Perform the API request
      console.log(patientNo, 'patient number');
      const response = await axios.get(
        `${API_URL}/data/odatafilter?webservice=QyTreatmentHeaders&isList=true&query=$filter=PatientNo eq '${patientNo}' and Status eq '${status}'`
        ,
        config
      );
      // console.log(response.data);
  
      dispatch({ type: GET_CONSULTATION_SUCCESS, payload: response.data });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch Encounter Details";
  
      // Display error notification
      message.error(errorMessage);
  
      dispatch({ type: GET_CONSULTATION_FAILURE, payload: errorMessage });
    }
}

