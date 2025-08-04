import axios from "axios";
import apiHeaderConfig from "../configHelpers";

export const RETURN_DRUGS_FAIL = "RETURN_DRUGS_FAIL";
export const RETURN_DRUGS_RESET = "RETURN_DRUGS_RESET";
export const RETURN_DRUGS_REQUEST = "RETURN_DRUGS_REQUEST";
export const RETURN_DRUGS_SUCCESS = "RETURN_DRUGS_SUCCESS";

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL;

export const returnDrugs = (values) => async (dispatch, getState) => {
  try {
    dispatch({ type: RETURN_DRUGS_REQUEST });

    const config = apiHeaderConfig(getState);

    const { data } = await axios.post(
      `${API_URL}/Pharmacy/PostPharmacyReturn`,
      values,
      config
    );

    console.log({ data });

    dispatch({ type: RETURN_DRUGS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: RETURN_DRUGS_FAIL,
      payload: error.message,
      status: error.response?.status || "Network Error",
      data: error.response?.data || null,
    });
  }
};
