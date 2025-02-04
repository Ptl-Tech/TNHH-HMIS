import axios from "axios";
import apiHeaderConfig from "../configHelpers";

export const UPDATE_TRIAGE_LIST_VITALS_REQUEST = 'UPDATE_TRIAGE_LIST_VITALS_REQUEST';
export const UPDATE_TRIAGE_LIST_VITALS_SUCCESS = 'UPDATE_TRIAGE_LIST_VITALS_SUCCESS';
export const UPDATE_TRIAGE_LIST_VITALS_FAIL = 'UPDATE_TRIAGE_LIST_VITALS_FAIL';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8085';

export const updateTriageListVitalsSlice = (vitals) => async (dispatch, getState) => {
    try {
      dispatch({ type: UPDATE_TRIAGE_LIST_VITALS_REQUEST });
  
      const updatedVitals = { ...vitals }; // Add myAction
      const config = apiHeaderConfig(getState);

      console.log('Updated Vitals:', updatedVitals);
  
      const response = await axios.post(`${API_URL}/Triage/Vitals`, updatedVitals, config);
  
      dispatch({ type: UPDATE_TRIAGE_LIST_VITALS_SUCCESS, payload: response.data });
      return response.data;
  
    } catch (error) {
      dispatch({ type: UPDATE_TRIAGE_LIST_VITALS_FAIL, payload: error.response?.data || error.message });
      console.error("Error updating vitals:", error);
    }
  };
  