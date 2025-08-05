import axios from "axios";

const API = import.meta.env.VITE_PORTAL_API_BASE_URL;

export const RESET_PASSWORD_FAIL = "RESET_PASSWORD_FAIL";
export const RESET_PASSWORD_REQUEST = "RESET_PASSWORD_REQUEST";
export const RESET_PASSWORD_SUCCESS = "RESET_PASSWORD_SUCCESS";

export const resetPassword =
  ({ newPassword, confirmPassword, resetTokenCode }) =>
  async (dispatch, getState) => {
    dispatch({ type: RESET_PASSWORD_REQUEST });

    // getting the staffNo from the state
    const {
      auth: { staffNo },
    } = getState();

    try {
      await axios.post(`${API}/api/Auth/ResetPassword`, {
        staffNo,
        newPassword,
        resetTokenCode,
        confirmPassword,
      });

      dispatch({
        type: RESET_PASSWORD_SUCCESS,
        payload:
          "You have successfully changed your password, Log in to continue",
      });
    } catch (error) {
      dispatch({
        type: RESET_PASSWORD_FAIL,
        payload:
          error.response.statusText ||
          (typeof error.response.data.errors === "string" &&
            error.response.data.errors) ||
          error.response.data.errors?.staffNo?.at(0) ||
          error.response.data.errors.title ||
          "Something went wrong",
      });
    }
  };
