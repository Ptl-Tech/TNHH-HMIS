import axios from "axios";
import apiHeaderConfig from "../configHelpers";

export const POST_LAB_HEADER_FAIL = "POST_LAB_HEADER_FAIL";
export const POST_LAB_HEADER_RESET = "POST_LAB_HEADER_RESET";
export const POST_LAB_HEADER_REQUEST = "POST_LAB_HEADER_REQUEST";
export const POST_LAB_HEADER_SUCCESS = "POST_LAB_HEADER_SUCCESS";

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL ||
  "https://chiromo.potestastechnologies.net:8085";

export const createLabTestHeader =
  (labHeaderData) => async (dispatch, getState) => {
    console.log({ labHeaderData });

    try {
      dispatch({ type: POST_LAB_HEADER_REQUEST });

      const config = apiHeaderConfig(getState);

      const { data } = await axios.post(
        `${API_URL}/Laboratory/LabTestheader`,
        labHeaderData,
        config
      );

      dispatch({ type: POST_LAB_HEADER_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: POST_LAB_HEADER_FAIL,
        payload: error.message,
        status: error.response?.status || "Network Error",
        data: error.response?.data || null,
      });
    }
  };
