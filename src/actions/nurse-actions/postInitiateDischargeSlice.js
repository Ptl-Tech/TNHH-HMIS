import configHelpers from "../configHelpers";
import axios from "axios";

export const POST_INITIATE_DISCHARGE_REQUEST =
  "POST_INITIATE_DISCHARGE_REQUEST";
export const POST_INITIATE_DISCHARGE_SUCCESS =
  "POST_INITIATE_DISCHARGE_SUCCESS";
export const POST_INITIATE_DISCHARGE_FAILURE =
  "POST_INITIATE_DISCHARGE_FAILURE";

export const POST_DISCHARGE_SUMMARY_RESET = "POST_DISCHARGE_SUMMARY_RESET";
export const POST_DISCHARGE_SUMMARY_REQUEST = "POST_DISCHARGE_SUMMARY_REQUEST";
export const POST_DISCHARGE_SUMMARY_SUCCESS = "POST_DISCHARGE_SUMMARY_SUCCESS";
export const POST_DISCHARGE_SUMMARY_FAILURE = "POST_DISCHARGE_SUMMARY_FAILURE";

export const GET_DISCHARGE_SUMMARY_REQUEST = "GET_DISCHARGE_SUMMARY_REQUEST";
export const GET_DISCHARGE_SUMMARY_SUCCESS = "GET_DISCHARGE_SUMMARY_SUCCESS";
export const GET_DISCHARGE_SUMMARY_FAILURE = "GET_DISCHARGE_SUMMARY_FAILURE";

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL ||
  "https://chiromo.potestastechnologies.net:8085";

export const postInitiateDischargeSlice =
  (endpoint = "/Inpatient/InitiateDischarge", initiateDischargeData) =>
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
      dispatch({ type: POST_INITIATE_DISCHARGE_REQUEST });

      const { data } = await axios.post(
        `${API_URL}${endpoint}`,
        initiateDischargeData,
        config
      );

      dispatch({ type: POST_INITIATE_DISCHARGE_SUCCESS, payload: data });

      return { type: POST_INITIATE_DISCHARGE_SUCCESS, payload: data };
    } catch (error) {
      dispatch({
        type: POST_INITIATE_DISCHARGE_FAILURE,
        payload: error.response?.data?.message || error.message,
      });

      return { type: POST_INITIATE_DISCHARGE_FAILURE, payload: error };
    }
  };

export const postDischargeSummary =
  (dischargeSummary) => async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
      dispatch({ type: POST_DISCHARGE_SUMMARY_REQUEST });

      const { data } = await axios.post(
        `${API_URL}/Inpatient/DischargeSummary`,
        dischargeSummary,
        config
      );

      dispatch({ type: POST_DISCHARGE_SUMMARY_SUCCESS, payload: data });

      return { type: POST_DISCHARGE_SUMMARY_SUCCESS, payload: data };
    } catch (error) {
      dispatch({
        type: POST_DISCHARGE_SUMMARY_FAILURE,
        payload: error.response?.data?.message || error.message,
      });

      return { type: POST_DISCHARGE_SUMMARY_FAILURE, payload: error };
    }
  };

export const getDischargeSummary =
  (admissionNo) => async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
      dispatch({ type: GET_DISCHARGE_SUMMARY_REQUEST });

      const { data } = await axios.get(
        `${API_URL}/data/odatafilter?webservice=QyDischargeSummaryList&isList=true&query=$filter=Discharge_Code eq '${admissionNo}'`,
        config
      );

      dispatch({ type: GET_DISCHARGE_SUMMARY_SUCCESS, payload: data });

      return { type: GET_DISCHARGE_SUMMARY_SUCCESS, payload: data };
    } catch (error) {
      dispatch({
        type: POST_DISCHARGE_SUMMARY_FAILURE,
        payload: error.response?.data?.message || error.message,
      });

      return { type: GET_DISCHARGE_SUMMARY_FAILURE, payload: error };
    }
  };
