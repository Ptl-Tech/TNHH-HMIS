import axios from "axios";
import configHelpers from "../configHelpers";

export const GET_SINGLE_ADMITTED_ERROR = "GET_SINGLE_ADMITTED_ERROR";
export const GET_SINGLE_ADMITTED_RESET = "GET_SINGLE_ADMITTED_RESET";
export const GET_SINGLE_ADMITTED_REQUEST = "GET_SINGLE_ADMITTED_REQUEST";
export const GET_SINGLE_ADMITTED_SUCCESS = "GET_SINGLE_ADMITTED_SUCCESS";

export const getSingleAdmittedSlice =
  (admissionNo) => async (dispatch, getState) => {
    try {
      dispatch({ type: GET_SINGLE_ADMITTED_REQUEST });

      const config = configHelpers(getState);

      const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL;

      const query = `${API_URL}/data/odatafilter?webservice=QyAdmissionsList&isList=false&query=$filter=Admission_No eq '${admissionNo}'`;

      const { data } = await axios.get(query, config);

      dispatch({ type: GET_SINGLE_ADMITTED_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: GET_SINGLE_ADMITTED_ERROR,
        payload: {
          message: error.message,
          data: error.response.data,
          status: error.response?.status || "Network Error",
        },
      });
    }
  };
