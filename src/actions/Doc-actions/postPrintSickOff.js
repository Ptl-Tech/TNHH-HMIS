import axios from "axios";
import apiHeaderConfig from "../configHelpers";

const API = "https://chiromo.potestastechnologies.net:8091/";

export const POST_PRINT_SICK_OFF_REQUEST = "POST_PRINT_SICK_OFF_REQUEST";
export const POST_PRINT_SICK_OFF_FAIL = "POST_PRINT_SICK_OFF_FAIL";
export const POST_PRINT_SICK_OFF_SUCCESS = "POST_PRINT_SICK_OFF_SUCCESS";
export const POST_PRINT_SICK_OFF_RESET = "POST_PRINT_SICK_OFF_RESET";

export const postPrintSickOff = (data) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_PRINT_SICK_OFF_REQUEST });

    const config = apiHeaderConfig(getState);
    const query = `${API}Reports/SickoffSheet`;
    const response = await axios.post(query, data, config);

    const responseData = {
      status: response.data.status,
      data: response.data,
    };

    dispatch({ type: POST_PRINT_SICK_OFF_SUCCESS, payload: responseData });
  } catch (error) {
    dispatch({
      type: POST_PRINT_SICK_OFF_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};
