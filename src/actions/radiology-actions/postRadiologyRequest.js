import axios from "axios";
import apiHeaderConfig from "../configHelpers";

export const POST_RADIOLOGY_REQUEST_FAIL = "POST_RADIOLOGY_REQUEST_FAIL";
export const POST_RADIOLOGY_REQUEST_RESET = "POST_RADIOLOGY_REQUEST_RESET";
export const POST_RADIOLOGY_REQUEST_REQUEST = "POST_RADIOLOGY_REQUEST_REQUEST";
export const POST_RADIOLOGY_REQUEST_SUCCESS = "POST_RADIOLOGY_REQUEST_SUCCESS";

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL;

export const postRadiologyRequest =
  (requestData) => async (dispatch, getState) => {
    console.log({ requestData });

    try {
      dispatch({ type: POST_RADIOLOGY_REQUEST_REQUEST });

      const config = apiHeaderConfig(getState);

      //   TODO Create the endpoint to post the radiology request
      //   const { data } = await axios.post(
      //     `${API_URL}/Laboratory/LabTestheader`,
      //     labHeaderData,
      //     config,
      //   );

      const data = { status: "success" };

      dispatch({ type: POST_RADIOLOGY_REQUEST_SUCCESS, payload: data });
    } catch (error) {
      console.log({ error });

      dispatch({
        type: POST_RADIOLOGY_REQUEST_FAIL,
        payload: error.message,
        status: error.response?.status || "Network Error",
        data: error.response?.data || null,
      });
    }
  };
