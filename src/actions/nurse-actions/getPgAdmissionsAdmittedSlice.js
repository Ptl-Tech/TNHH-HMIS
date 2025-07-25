import configHelpers from "../configHelpers";
import axios from "axios";

export const GET_PG_ADMISSIONS_ADMITTED_REQUEST =
  "GET_PG_ADMISSIONS_ADMITTED_REQUEST";
export const GET_PG_ADMISSIONS_ADMITTED_SUCCESS =
  "GET_PG_ADMISSIONS_ADMITTED_SUCCESS";
export const GET_PG_ADMISSIONS_ADMITTED_FAILURE =
  "GET_PG_ADMISSIONS_ADMITTED_FAILURE";
export const GET_PG_ADMISSIONS_REQUEST = "GET_PG_ADMISSIONS_REQUEST";
export const GET_PG_ADMISSIONS_SUCCESS = "GET_PG_ADMISSIONS_SUCCESS";
export const GET_PG_ADMISSIONS_FAILURE = "GET_PG_ADMISSIONS_FAILURE";
export const GET_PG_ADMISSIONS_RESET = "GET_PG_ADMISSIONS_RESET";
const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL ||
  "https://chiromo.potestastechnologies.net:8085";

export const getPgAdmissionsAdmittedSlice =
  (admissionNo) => async (dispatch, getState) => {
    var query = `${API_URL}/data/odatafilter?webservice=QyAdmissionsList&isList=true`;

    if (admissionNo) query += `&query=$filter=Admission_No eq '${admissionNo}'`;

    const config = configHelpers(getState);
    try {
      dispatch({ type: GET_PG_ADMISSIONS_ADMITTED_REQUEST });

      const { data } = await axios.get(query, config);

      console.log({ data });

      dispatch({ type: GET_PG_ADMISSIONS_ADMITTED_SUCCESS, payload: data });

      return { type: GET_PG_ADMISSIONS_ADMITTED_SUCCESS, payload: data };
    } catch (error) {
      dispatch({
        type: GET_PG_ADMISSIONS_ADMITTED_FAILURE,
        payload: {
          message: error.message,
          status: error.response?.status || "Network Error",
          data: error.response?.data || null,
        },
      });

      return { type: GET_PG_ADMISSIONS_ADMITTED_FAILURE, payload: error };
    }
  };

export const getPgAdmissions = () => async (dispatch, getState) => {
  var query = `${API_URL}/data/odatafilter?webservice=QyAdmissionsList&isList=true`;

  const config = configHelpers(getState);
  try {
    dispatch({ type: GET_PG_ADMISSIONS_REQUEST });

    const { data } = await axios.get(query, config);

    console.log({ data });

    dispatch({ type: GET_PG_ADMISSIONS_SUCCESS, payload: data });

    return { type: GET_PG_ADMISSIONS_SUCCESS, payload: data };
  } catch (error) {
    dispatch({
      type: GET_PG_ADMISSIONS_FAILURE,
      payload: {
        message: error.message,
        status: error.response?.status || "Network Error",
        data: error.response?.data || null,
      },
    });

    return { type: GET_PG_ADMISSIONS_FAILURE, payload: error };
  }
};
