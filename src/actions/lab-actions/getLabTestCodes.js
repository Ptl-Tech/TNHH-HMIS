import axios from "axios";
import { message } from "antd";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

// Action Types
export const GET_LAB_TEST_CODES_FAIL = "GET_LAB_TEST_CODES_FAIL";
export const GET_LAB_TEST_CODES_RESET = "GET_LAB_TEST_CODES_RESET";
export const GET_LAB_TEST_CODES_REQUEST = "GET_LAB_TEST_CODES_REQUEST";
export const GET_LAB_TEST_CODES_SUCCESS = "GET_LAB_TEST_CODES_SUCCESS";

// Action to fetch radiology list
export const getLabTestCodes = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_LAB_TEST_CODES_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();

    // Ensure `branchCode` is correctly fetched from localStorage
    const branchCode = localStorage.getItem("branchCode") || "";

    // Set up the request configuration with headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo?.userData?.no || "",
        sessionToken: userInfo?.userData?.portalSessionToken || "",
        branchCode,
      },
    };

    // API request
    const { data } = await axios.get(
      `${API}data/odatafilter?isList=true&webservice=QyLabTestsSetup`,
      config
    );

    // Dispatch success action with the fetched data
    dispatch({
      type: GET_LAB_TEST_CODES_SUCCESS,
      payload: data,
    });

    return data; // Optionally return the data
  } catch (error) {
    // Extract and handle errors properly
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";

    dispatch({
      type: GET_LAB_TEST_CODES_FAIL,
      payload: errorMessage,
    });

    message.error(errorMessage, 5); // Display the error message to the user

    throw error; // Rethrow the error if needed
  }
};
