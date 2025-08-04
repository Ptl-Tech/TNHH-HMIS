import axios from "axios";

const API = import.meta.env.VITE_PORTAL_API_BASE_URL;

export const USER_FORGOT_PASSWORD_FAIL = "USER_FORGOT_PASSWORD_FAIL";
export const USER_FORGOT_PASSWORD_REQUEST = "USER_FORGOT_PASSWORD_REQUEST";
export const USER_FORGOT_PASSWORD_SUCCESS = "USER_FORGOT_PASSWORD_SUCCESS";

export const forgotPassword =
  ({ staffNo }) =>
  async (dispatch) => {
    try {
      dispatch({ type: USER_FORGOT_PASSWORD_REQUEST });

      const response = await axios.post(`${API}/api/Auth/ForgotPassword`, {
        staffNo,
      });

      dispatch({
        type: USER_FORGOT_PASSWORD_SUCCESS,
        payload: { staffNo, forgotPasswordSuccess: response.data.msg },
      });
    } catch (error) {
      console.log({ error });

      dispatch({
        type: USER_FORGOT_PASSWORD_FAIL,
        payload:
          error.response.statusText ||
          error.response.data.errors ||
          "Something went wrong",
      });
    }
  };
