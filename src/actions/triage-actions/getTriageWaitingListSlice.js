import axios from "axios";
import configHelpers from '../../actions/configHelpers'

export const GET_TRIAGE_WAITING_LIST_REQUEST = 'GET_TRIAGE_WAITING_LIST_REQUEST';
export const GET_TRIAGE_WAITING_LIST_SUCCESS = 'GET_TRIAGE_WAITING_LIST_SUCCESS';
export const GET_TRIAGE_WAITING_LIST_FAILURE = 'GET_TRIAGE_WAITING_LIST_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8091';

export const getTriageWaitingList = () => async (dispatch, getState) => {
  dispatch({ type: GET_TRIAGE_WAITING_LIST_REQUEST });
  
  const config = configHelpers(getState);

  try {
    const response = await axios.get(`${API_URL}/data/odatafilter?webservice=QyPatients&isList=true`, config);
    dispatch({ type: GET_TRIAGE_WAITING_LIST_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_TRIAGE_WAITING_LIST_FAILURE, payload: error.message });
  }
};

