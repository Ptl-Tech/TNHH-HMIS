import axios from "axios";

const API = import.meta.env.VITE_PORTAL_API_BASE_URL;

export const USER_LOGOUT_FAIL = "USER_LOGOUT_FAIL";
export const USER_LOGOUT_REQUEST = "USER_LOGOUT_REQUEST";
export const USER_LOGOUT_SUCCESS = "USER_LOGOUT_SUCCESS";

export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGOUT_REQUEST });

    const response = await axios.post(`${API}/api/Auth/logout`, {
      withCredentials: true,
    });

    console.log({ response });

    dispatch({
      type: USER_LOGOUT_SUCCESS,
      payload: {
        response,
      },
    });
  } catch (error) {
    dispatch({
      type: USER_LOGOUT_FAIL,
      payload:
        error.response.data.error ||
        error.response.statusText ||
        error.response.data.errors ||
        "Something went wrong",
    });
  }
};
