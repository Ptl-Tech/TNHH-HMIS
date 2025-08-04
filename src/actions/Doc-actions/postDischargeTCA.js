import axios from "axios";
import apiHeaderConfig from "../configHelpers";

const API = "https://chiromo.potestastechnologies.net:8091/";

export const POST_DISCHARGE_TCA_REQUEST = "POST_DISCHARGE_TCA_REQUEST";
export const POST_DISCHARGE_TCA_FAIL = "POST_DISCHARGE_TCA_FAIL";
export const POST_DISCHARGE_TCA_SUCCESS = "POST_DISCHARGE_TCA_SUCCESS";
export const POST_DISCHARGE_TCA_RESET = "POST_DISCHARGE_TCA_RESET";

export const postDischargeTCA = (data) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_DISCHARGE_TCA_REQUEST });

    const config = apiHeaderConfig(getState);
    const query = `${API}Appointment/PostDoctorTCABooking`;
    const response = await axios.post(query, data, config);

    const responseData = {
      status: response.data.status,
      data: response.data,
    };

    dispatch({ type: POST_DISCHARGE_TCA_SUCCESS, payload: responseData });
  } catch (error) {
    dispatch({
      type: POST_DISCHARGE_TCA_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};
