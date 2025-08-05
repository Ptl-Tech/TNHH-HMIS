import axios from "axios";
import { message } from "antd";
import apiHeaderConfig from "../configHelpers";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

// Action Types
export const GET_LAB_TEST_RESULTS_FAIL = "GET_LAB_TEST_RESULTS_FAIL";
export const GET_LAB_TEST_RESULTS_RESET = "GET_LAB_TEST_RESULTS_RESET";
export const GET_LAB_TEST_RESULTS_REQUEST = "GET_LAB_TEST_RESULTS_REQUEST";
export const GET_LAB_TEST_RESULTS_SUCCESS = "GET_LAB_TEST_RESULTS_SUCCESS";

// Action to fetch radiology list
export const getLabTestResults =
  ({ labNo, testCode }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: GET_LAB_TEST_RESULTS_REQUEST });

      // Set up the request configuration with headers
      const config = apiHeaderConfig(getState);

      // API request
      const { data } = await axios.get(
        `${API}data/odatafilter?isList=true&webservice=QyLaboratoryResultsEntry&query=$filter=Laboratory_No eq '${labNo}' and Laboratory_Test_Code eq '${testCode}'`,
        config
      );

      console.log({ data, labNo, testCode });

      // Dispatch success action with the fetched data
      dispatch({
        type: GET_LAB_TEST_RESULTS_SUCCESS,
        payload: data,
      });

      return data; // Optionally return the data
    } catch (error) {
      // Extract and handle errors properly
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";

      dispatch({
        type: GET_LAB_TEST_RESULTS_FAIL,
        payload: errorMessage,
      });

      message.error(errorMessage, 5); // Display the error message to the user

      throw error; // Rethrow the error if needed
    }
  };
