import axios from "axios";
import apiHeaderConfig from "../configHelpers";

export const POST_DISPATCH_TO_LAB_FAIL = "POST_DISPATCH_TO_LAB_FAIL";
export const POST_DISPATCH_TO_LAB_RESET = "POST_DISPATCH_TO_LAB_RESET";
export const POST_DISPATCH_TO_LAB_REQUEST = "POST_DISPATCH_TO_LAB_REQUEST";
export const POST_DISPATCH_TO_LAB_SUCCESS = "POST_DISPATCH_TO_LAB_SUCCESS";

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL ||
  "https://chiromo.potestastechnologies.net:8091";

export const dispatchToLab = (patientNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_DISPATCH_TO_LAB_REQUEST });

    const config = apiHeaderConfig(getState);

    const { data } = await axios.post(
      `${API_URL}/Laboratory/DirectLabRequest`,
      patientNo,
      config
    );

    dispatch({ type: POST_DISPATCH_TO_LAB_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      payload: error.message,
      type: POST_DISPATCH_TO_LAB_FAIL,
      data: error.response?.data || null,
      status: error.response?.status || "Network Error",
    });
  }
};
