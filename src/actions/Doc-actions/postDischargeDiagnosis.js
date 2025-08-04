import axios from "axios";
import apiHeaderConfig from "../configHelpers";

const API = "https://chiromo.potestastechnologies.net:8091/";

export const POST_DISCHARGE_DIAGNOSIS_REQUEST =
  "POST_DISCHARGE_DIAGNOSIS_REQUEST";
export const POST_DISCHARGE_DIAGNOSIS_FAIL = "POST_DISCHARGE_DIAGNOSIS_FAIL";
export const POST_DISCHARGE_DIAGNOSIS_SUCCESS =
  "POST_DISCHARGE_DIAGNOSIS_SUCCESS";
export const POST_DISCHARGE_DIAGNOSIS_RESET = "POST_DISCHARGE_DIAGNOSIS_RESET";

export const postDischargeDiagnosis = (data) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_DISCHARGE_DIAGNOSIS_REQUEST });

    const config = apiHeaderConfig(getState);
    const query = `${API}Admission/InPatientFinalDiagnosis`;
    const response = await axios.post(query, data, config);

    const responseData = {
      status: response.data.status,
      data: response.data,
    };

    dispatch({ type: POST_DISCHARGE_DIAGNOSIS_SUCCESS, payload: responseData });
  } catch (error) {
    dispatch({
      type: POST_DISCHARGE_DIAGNOSIS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};
