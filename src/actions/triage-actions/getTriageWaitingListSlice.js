import axios from "axios";

export const GET_TRIAGE_WAITING_LIST_REQUEST = 'GET_TRIAGE_WAITING_LIST_REQUEST';
export const GET_TRIAGE_WAITING_LIST_SUCCESS = 'GET_TRIAGE_WAITING_LIST_SUCCESS';
export const GET_TRIAGE_WAITING_LIST_FAILURE = 'GET_TRIAGE_WAITING_LIST_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const getTriageWaitingList = () => async (dispatch, getState) => {
  dispatch({ type: GET_TRIAGE_WAITING_LIST_REQUEST });
  const {
    otpVerify: { userInfo },
  } = getState();

  const branchCode = localStorage.getItem("branchCode");
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.accessToken}`,
      sessionToken: userInfo.userData.portalSessionToken,
      staffNo: userInfo.userData.no,
      branchCode: branchCode
    },
  };

  try {
    const response = await axios.get(`${API_URL}/data/odatafilter?webservice=QyPatients&isList=true`, config);
    dispatch({ type: GET_TRIAGE_WAITING_LIST_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_TRIAGE_WAITING_LIST_FAILURE, payload: error.message });
  }
};

