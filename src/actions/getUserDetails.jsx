import axios from "axios";

export const GET_USER_DETAILS_FAIL = "GET_USER_DETAILS_FAIL";
export const GET_USER_DETAILS_RESET = "GET_USER_DETAILS_RESET";
export const GET_USER_DETAILS_REQUEST = "GET_USER_DETAILS_REQUEST";
export const GET_USER_DETAILS_SUCCESS = "GET_USER_DETAILS_SUCCESS";

const API = import.meta.env.VITE_PORTAL_API_BASE_URL;

export const getUserDetails = () => async (dispatch, getState) => {
  dispatch({ type: GET_USER_DETAILS_REQUEST });
  try {
    // TODO: ensure the endpoint is established
    const response = await axios.get(`${API}/me`);
    console.log({ response });
  } catch (error) {
    console.log({ error });
  }
};
