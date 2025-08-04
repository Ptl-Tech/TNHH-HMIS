import axios from "axios";
import { message } from "antd";
import apiHeaderConfig from "../configHelpers";

const API = "https://chiromo.potestastechnologies.net:8091/";

// Action Types
export const REQUEST_LAB_DETAILS = "REQUEST_LAB_DETAILS";
export const REQUEST_LAB_DETAILS_FAIL = "REQUEST_LAB_DETAILS_FAIL";
export const REQUEST_LAB_DETAILS_RESET = "REQUEST_LAB_DETAILS_RESET";
export const REQUEST_LAB_DETAILS_SUCCESS = "REQUEST_LAB_DETAILS_SUCCESS";

export const getLabDetails = (labNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_LAB_DETAILS });
    var query = `${API}data/odatafilter?isList=true&webservice=PgLaboratoryTestLines&query=$filter=Laboratory_No eq '${labNo}'`;

    // Set up the request configuration with headers
    const config = apiHeaderConfig(getState);

    // API request
    const { data } = await axios.get(query, config);

    // Dispatch success action with the fetched data
    dispatch({
      type: REQUEST_LAB_DETAILS_SUCCESS,
      payload: data,
    });

    return data; // Optionally return the data
  } catch (error) {
    // Extract and handle errors properly
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";

    dispatch({
      type: REQUEST_LAB_DETAILS_FAIL,
      payload: errorMessage,
    });

    message.error(errorMessage, 5); // Display the error message to the user

    throw error; // Rethrow the error if needed
  }
};
