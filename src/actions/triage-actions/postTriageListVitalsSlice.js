import axios from "axios";
import apiHeaderConfig from "../configHelpers";

export const POST_TRIAGE_LIST_VITALS_REQUEST =
  "POST_TRIAGE_LIST_VITALS_REQUEST";
export const POST_TRIAGE_LIST_VITALS_RESET = "POST_TRIAGE_LIST_VITALS_RESET";
export const POST_TRIAGE_LIST_VITALS_SUCCESS =
  "POST_TRIAGE_LIST_VITALS_SUCCESS";
export const POST_TRIAGE_LIST_VITALS_FAIL = "POST_TRIAGE_LIST_VITALS_FAIL";

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL;

export const postTriageListVitalsSlice =
  (vitals) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_TRIAGE_LIST_VITALS_REQUEST });

      const config = apiHeaderConfig(getState);

      const { data } = await axios.post(
        `${API_URL}/Triage/Vitals`,
        vitals,
        config
      );

      console.log("data from the API", data);
      dispatch({ type: POST_TRIAGE_LIST_VITALS_SUCCESS, payload: data });

      return { type: POST_TRIAGE_LIST_VITALS_SUCCESS, payload: data };
    } catch (error) {
      dispatch({
        type: POST_TRIAGE_LIST_VITALS_FAIL,
        payload: error.message,
        status: error.response?.status || "Network Error",
        data: error.response?.data || null,
      });
    }
  };
