import axios from "axios";
import { message } from "antd";
import apiHeaderConfig from "../configHelpers";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

// post radiology requests
export const POST_RADIOLOGY_RESULTS_REQUEST = "POST_RADIOLOGY_RESULTS_REQUEST";
export const POST_RADIOLOGY_RESULTS_SUCCESS = "POST_RADIOLOGY_RESULTS_SUCCESS";
export const POST_RADIOLOGY_RESULTS_FAIL = "POST_RADIOLOGY_RESULTS_FAIL";
export const POST_RADIOLOGY_RESULTS_RESET = "POST_RADIOLOGY_RESULTS_RESET";

// post radiology requests
export const FORWARD_RADIOLOGY_RESULTS_REQUEST = "FORWARD_RADIOLOGY_RESULTS_REQUEST";
export const FORWARD_RADIOLOGY_RESULTS_SUCCESS = "FORWARD_RADIOLOGY_RESULTS_SUCCESS";
export const FORWARD_RADIOLOGY_RESULTS_FAIL = "FORWARD_RADIOLOGY_RESULTS_FAIL";
export const FORWARD_RADIOLOGY_RESULTS_RESET = "FORWARD_RADIOLOGY_RESULTS_RESET";

// get single radiology details
export const GET_RADIOLOGY_DETAILS_REQUEST = "GET_RADIOLOGY_DETAILS_REQUEST";
export const GET_RADIOLOGY_DETAILS_SUCCESS = "GET_RADIOLOGY_DETAILS_SUCCESS";
export const GET_RADIOLOGY_DETAILS_FAIL = "GET_RADIOLOGY_DETAILS_FAIL";
export const GET_RADIOLOGY_DETAILS_RESET = "GET_RADIOLOGY_DETAILS_RESET";

export const postRadiologyResults = (resultsData) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_RADIOLOGY_RESULTS_REQUEST });

    const {
      auth: { user }
    } = getState();
    const branchCode = user.branchCode;

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: user.staffNo, // Add staffNo as a custom header
         // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    const response = await axios.post(`${API}Radiology/RequestLine`, resultsData, config);

    const responseData = {
      status: response.data.status,
      data: response.data,
    };

    dispatch({ type: POST_RADIOLOGY_RESULTS_SUCCESS, payload: responseData });

    // message.success("Radiology results posted successfully!");
    return responseData.data; // Return data for further use
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;

    dispatch({
      type: POST_RADIOLOGY_RESULTS_FAIL,
      payload: errorMessage,
    });

    // message.error(`Failed to post radiology results: ${errorMessage}`);
    throw error; // Rethrow the error to handle in the calling function
  }
};

export const forwardRadiologyResults = (radiologyNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: FORWARD_RADIOLOGY_RESULTS_REQUEST });

    const {
      auth: { user }
    } = getState();
    const branchCode = user.branchCode;

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: user.staffNo, // Add staffNo as a custom header
         // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    const response = await axios.post(`${API}Radiology/ForwardRequest`, radiologyNo, config);

    const responseData = {
      status: response.data.status,
      data: response.data,
    };

    dispatch({ type: FORWARD_RADIOLOGY_RESULTS_SUCCESS, payload: responseData });

    // message.success("Radiology results posted successfully!");
    return responseData.data; // Return data for further use
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;

    dispatch({
      type: FORWARD_RADIOLOGY_RESULTS_FAIL,
      payload: errorMessage,
    });

    // message.error(`Failed to post radiology results: ${errorMessage}`);
    throw error; // Rethrow the error to handle in the calling function
  }
};

export const getSingleRadiologyDetails = (radiologyNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_RADIOLOGY_DETAILS_REQUEST });

    const config = apiHeaderConfig(getState);
    // $filter=RadiologyNo eq 'RAD-0001
    const { data } = await axios.get(`${API}data/odatafilter?webservice=PgRadiologyList&query=$filter=RadiologyNo eq '${radiologyNo}'&isList=false`, config);
      dispatch({ type: GET_RADIOLOGY_DETAILS_SUCCESS, payload: data })
      console.log({ data, radiologyNo });

  } catch (error) {
    dispatch({ type: GET_RADIOLOGY_DETAILS_FAIL, payload: error.message });
    message.error(error.message, 5);
  }
};
