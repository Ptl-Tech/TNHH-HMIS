import axios from "axios";
import { message } from "antd";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

// Action Types
export const REQUEST_LAB_LIST = "REQUEST_LAB_LIST";
export const REQUEST_LAB_LIST_SUCCESS = "REQUEST_LAB_LIST_SUCCESS";
export const REQUEST_LAB_LIST_FAIL = "REQUEST_LAB_LIST_FAIL";
export const REQUEST_LAB_LIST_RESET = "REQUEST_LAB_LIST_RESET";

// Action to fetch lab list
export const getLabList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_LAB_LIST });

    const {
      auth: { user },
    } = getState();

    // Set up the request configuration with headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: user?.staffNo || "",
        branchCode: user?.branchCode,
      },
    };

    // API request
    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=PgLaboratoryTestHeaders`,
      config
    );

    console.log({ data });

    // Dispatch success action with the fetched data
    dispatch({
      type: REQUEST_LAB_LIST_SUCCESS,
      payload: data,
    });

    return data; // Optionally return the data
  } catch (error) {
    // Extract and handle errors properly
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";

    dispatch({
      type: REQUEST_LAB_LIST_FAIL,
      payload: errorMessage,
    });

    message.error(errorMessage, 5); // Display the error message to the user

    throw error; // Rethrow the error if needed
  }
};
