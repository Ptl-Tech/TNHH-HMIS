import axios from "axios";
import apiHeaderConfig from "../configHelpers";

const API = "https://chiromo.potestastechnologies.net:8085/";

// Action Types
export const REQUEST_SINGLE_LAB_DETAILS = "REQUEST_SINGLE_LAB_DETAILS";
export const REQUEST_SINGLE_LAB_DETAILS_FAIL =
  "REQUEST_SINGLE_LAB_DETAILS_FAIL";
export const REQUEST_SINGLE_LAB_DETAILS_RESET =
  "REQUEST_SINGLE_LAB_DETAILS_RESET";
export const REQUEST_SINGLE_LAB_DETAILS_SUCCESS =
  "REQUEST_SINGLE_LAB_DETAILS_SUCCESS";

export const getSingleLabDetails =
  (labNo, systemId) => async (dispatch, getState) => {
    try {
      dispatch({ type: REQUEST_SINGLE_LAB_DETAILS });
      var query = `${API}data/odatafilter?isList=false&webservice=PgLaboratoryTestLines&query=$filter=Laboratory_No eq '${labNo}' and SystemId eq ${systemId}`;

      const config = apiHeaderConfig(getState);

      // API request
      const { data } = await axios.get(query, config);

      // Dispatch success action with the fetched data
      dispatch({
        type: REQUEST_SINGLE_LAB_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error) {

      // Extract and handle errors properly
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";

      dispatch({
        payload: errorMessage,
        type: REQUEST_SINGLE_LAB_DETAILS_FAIL,
      });
    }
  };
