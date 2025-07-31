import axios from "axios";

const API = import.meta.env.VITE_PORTAL_API_BASE_URL;

export const USER_LOGIN_FAIL = "USER_LOGIN_FAIL";
export const USER_LOGIN_REQUEST = "USER_LOGIN_REQUEST";
export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";

export const login =
  ({ staffNo, password }) =>
  async (dispatch) => {
    try {
      dispatch({ type: USER_LOGIN_REQUEST });

      const response = await axios.post(
        `${API}/api/Auth/Login`,
        {
          staffNo,
          password,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: {
          userDetails: response.data,
          loginSuccess: response.data.message,
        },
      });
    } catch (error) {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload:
          error.response.data.error ||
          error.response.statusText ||
          error.response.data.errors ||
          "Something went wrong",
      });
    }
  };
