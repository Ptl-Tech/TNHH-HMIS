import configHelpers from "../../actions/configHelpers";
import axios from "axios";

export const GET_VITAL_LINES_REQUEST = "GET_VITAL_LINES_REQUEST";
export const GET_VITAL_LINES_SUCCESS = "GET_VITAL_LINES_SUCCESS";
export const GET_VITAL_LINES_FAILURE = "GET_VITAL_LINES_FAILURE";

export const GET_PATIENT_VITALS_LINES_REQUEST =
  "GET_PATIENT_VITALS_LINES_REQUEST";
export const GET_PATIENT_VITALS_LINES_SUCCESS =
  "GET_PATIENT_VITALS_LINES_SUCCESS";
export const GET_PATIENT_VITALS_LINES_FAILURE =
  "GET_PATIENT_VITALS_LINES_FAILURE";
export const GET_PATIENT_VITALS_LINES_RESET = "GET_PATIENT_VITALS_LINES_RESET";

export const GET_PATIENT_VITALS_BY_PATIENT_NUMBER_REQUEST =
  "GET_PATIENT_VITALS_BY_PATIENT_NUMBER_REQUEST";
export const GET_PATIENT_VITALS_BY_PATIENT_NUMBER_SUCCESS =
  "GET_PATIENT_VITALS_BY_PATIENT_NUMBER_SUCCESS";
export const GET_PATIENT_VITALS_BY_PATIENT_NUMBER_FAILURE =
  "GET_PATIENT_VITALS_BY_PATIENT_NUMBER_FAILURE";

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL;

export const getVitalsLinesSlice =
  (observationNo) => async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
      dispatch({ type: GET_VITAL_LINES_REQUEST });
      const { data } = await axios.get(
        `${API_URL}/data/odatafilter?webservice=QyVitalsLines&isList=true&query=$filter=ObservationNo eq '${observationNo}'`,
        config
      );

      dispatch({ type: GET_VITAL_LINES_SUCCESS, payload: data });

      return { type: GET_VITAL_LINES_SUCCESS, payload: data };
    } catch (error) {
      dispatch({
        type: GET_VITAL_LINES_SUCCESS,
        payload: {
          message: error.message,
          status: error.response?.status || "Network Error",
          data: error.response?.data || null,
        },
      });

      return { type: GET_VITAL_LINES_FAILURE, payload: error };
    }
  };

export const getSinglePatientAllVitalsLines =
  (patientNumber) => async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
      dispatch({ type: GET_PATIENT_VITALS_BY_PATIENT_NUMBER_REQUEST });
      const { data } = await axios.get(
        `${API_URL}/data/odatafilter?webservice=QyVitalsLines&isList=true&query=$filter=PatientNo eq '${patientNumber}'`,
        config
      );

      dispatch({
        type: GET_PATIENT_VITALS_BY_PATIENT_NUMBER_SUCCESS,
        payload: data,
      });

      return {
        type: GET_PATIENT_VITALS_BY_PATIENT_NUMBER_SUCCESS,
        payload: data,
      };
    } catch (error) {
      dispatch({
        type: GET_PATIENT_VITALS_BY_PATIENT_NUMBER_SUCCESS,
        payload: {
          message: error.message,
          status: error.response?.status || "Network Error",
          data: error.response?.data || null,
        },
      });

      return {
        type: GET_PATIENT_VITALS_BY_PATIENT_NUMBER_FAILURE,
        payload: error,
      };
    }
  };

export const getPatientVitalsLinesSlice = () => async (dispatch, getState) => {
  const config = configHelpers(getState);
  try {
    dispatch({ type: GET_PATIENT_VITALS_LINES_REQUEST });
    const { data } = await axios.get(
      `${API_URL}/data/odatafilter?webservice=QyVitalsLines&isList=true`,
      config
    );

    dispatch({ type: GET_PATIENT_VITALS_LINES_SUCCESS, payload: data });

    return data;
  } catch (error) {
    dispatch({
      type: GET_PATIENT_VITALS_LINES_FAILURE,
      payload: error.message,
    });
  }
};
