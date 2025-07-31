import axios from "axios";
import apiHeaderConfig from "../configHelpers";
import { message } from "antd";

export const POST_DOC_INJECTIONS_REQUEST = "POST_INJECTIONS_REQUEST";
export const POST_DOC_INJECTIONS_SUCCESS = "POST_INJECTIONS_SUCCESS";
export const POST_DOC_INJECTIONS_FAIL = "POST_INJECTIONS_FAIL";

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL || "https://chiromo.potestastechnologies.net:8091";

export const postDocInjectionsSlice =
  (injections) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_DOC_INJECTIONS_REQUEST });

      const config = apiHeaderConfig(getState);
      const response = await axios.post(
        `${API_URL}/Doctor/PatientInjections`,
        injections,
        config
      );
      setTimeout(() => {
        dispatch({ type: POST_DOC_INJECTIONS_SUCCESS, payload: response.data });
        message.success("Injections posted successfully", 5);

      }, 1200)


      return response.data;
    } catch (error) {
     setTimeout(()=>{
        dispatch({
            type: POST_DOC_INJECTIONS_FAIL,
            payload: error.response?.data?.errors || error.errors,
        });
        message.error(error.response?.data?.errors || error.errors);
     }, 1200)
  }
  };


