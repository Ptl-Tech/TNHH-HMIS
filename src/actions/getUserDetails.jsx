import axios from "axios";

export const GET_USER_DETAILS_FAIL = "GET_USER_DETAILS_FAIL";
export const GET_USER_DETAILS_REQUEST = "GET_USER_DETAILS_REQUEST";
export const GET_USER_DETAILS_SUCCESS = "GET_USER_DETAILS_SUCCESS";

const API = import.meta.env.VITE_PORTAL_API_BASE_URL;

export const getUserDetails = () => async (dispatch, getState) => {
  dispatch({ type: GET_USER_DETAILS_REQUEST });
  try {
    const response = await axios.get(`${API}/api/Users/me`, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    return dispatch({ type: GET_USER_DETAILS_SUCCESS, payload: response.data });
  } catch (error) {
    console.log({ error });
    dispatch({ type: GET_USER_DETAILS_FAIL, payload: error.message });
  }
};
