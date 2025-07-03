import configHelpers from "../../actions/configHelpers";
import axios from "axios";

export const GET_TRIAGE_LIST_REQUEST = "GET_TRIAGE_LIST_REQUEST";
export const GET_TRIAGE_LIST_SUCCESS = "GET_TRIAGE_LIST_SUCCESS";
export const GET_TRIAGE_LIST_FAILURE = "GET_TRIAGE_LIST_FAILURE";

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL ||
  "https://chiromo.potestastechnologies.net:8085";

export const getTriageList =
  ({ key, value }) =>
  async (dispatch, getState) => {
    console.log({ ObservationNo });

    const filters = key && value ? `&query=$filter=${key} eq '${value}'` : "";
    const config = configHelpers(getState);
    const query = `${API_URL}/data/odatafilter?webservice=QyTriageList&isList=true${filters}`;

    try {
      dispatch({ type: GET_TRIAGE_LIST_REQUEST });
      const { data } = await axios.get(query, config);

      dispatch({ type: GET_TRIAGE_LIST_SUCCESS, payload: data });

      return { type: GET_TRIAGE_LIST_SUCCESS, payload: data };
    } catch (error) {
      console.log({ error });

      dispatch({
        type: GET_TRIAGE_LIST_FAILURE,
        payload: {
          message: error.message,
          status: error.response?.status || "Network Error",
          data: error.response?.data || null,
        },
      });
      return { type: GET_TRIAGE_LIST_FAILURE, payload: error };
    }
  };
