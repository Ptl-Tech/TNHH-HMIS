import axios from "axios";

const API = import.meta.env.VITE_PORTAL_API_BASE_URL;

export const VERIFY_OTP_FAIL = "VERIFY_OTP_FAIL";
export const VERIFY_OTP_REQUEST = "VERIFY_OTP_REQUEST";
export const VERIFY_OTP_SUCCESS = "VERIFY_OTP_SUCCESS";

export const verifyOTP =
  ({ otpCode }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: VERIFY_OTP_REQUEST });

      const { auth } = getState() || {};
      const { userDetails } = auth || {};
      const { employeeNo: staffNo } = userDetails || {};

      const response = await axios.post(`${API}/api/Auth/verify-otp`, {
        otpCode,
        staffNo,
      });

      console.log({ response });

      dispatch({
        type: VERIFY_OTP_SUCCESS,
        payload: {
          data: response.data,
          OTPSuccess: "You have successfully logged in",
        },
      });
    } catch (error) {
      console.log({ error });

      dispatch({
        type: VERIFY_OTP_FAIL,
        payload:
          error?.response?.data?.errors ||
          error?.response?.data?.error ||
          error?.response?.statusText ||
          "Something went wrong",
      });
    }
  };
