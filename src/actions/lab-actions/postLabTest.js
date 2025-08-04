import axios from "axios";
import apiHeaderConfig from "../configHelpers";

export const POST_LAB_TEST_FAIL = "POST_LAB_TEST_FAIL";
export const POST_LAB_TEST_RESET = "POST_LAB_TEST_RESET";
export const POST_LAB_TEST_REQUEST = "POST_LAB_TEST_REQUEST";
export const POST_LAB_TEST_SUCCESS = "POST_LAB_TEST_SUCCESS";

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL;

export const postLabTest = (params) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_LAB_TEST_REQUEST });

    const config = apiHeaderConfig(getState);

    const { data } = await axios.post(
      `${API_URL}/laboratory/LabTestLine`,
      params,
      config
    );

    dispatch({ type: POST_LAB_TEST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: POST_LAB_TEST_FAIL,
      payload: error.message,
      status: error.response?.status || "Network Error",
      data: error.response?.data || null,
    });
  }
};
