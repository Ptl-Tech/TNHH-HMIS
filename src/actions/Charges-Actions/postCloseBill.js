import { message } from "antd";
import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const POST_CLOSE_PATIENT_BILL_REQUEST =
  "POST_CLOSE_PATIENT_BILL_REQUEST";
export const POST_CLOSE_PATIENT_BILL_SUCCESS =
  "POST_CLOSE_PATIENT_BILL_SUCCESS";
export const POST_CLOSE_PATIENT_BILL_FAIL = "POST_CLOSE_PATIENT_BILL_FAIL";
export const POST_CLOSE_PATIENT_BILL_RESET = "POST_CLOSE_PATIENT_BILL_RESET";

export const postClosePatientBill = (data) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_CLOSE_PATIENT_BILL_REQUEST });

    const {
      auth: { user },
    } = getState();

    const staffNo = user.staffNo;
    const branchCode = user.branchCode;

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: staffNo,
        branchCode: branchCode,
      },
    };

    const payloadData = {
      ...data,
      staffNo,
    };

    const response = await axios.post(
      `${API}Reception/CloseBill`,
      payloadData,
      config
    );

    dispatch({ type: POST_CLOSE_PATIENT_BILL_SUCCESS, payload: response.data });

    return response.data.status;
  } catch (error) {
    const errorMessage =
      error.response?.data?.errors ||
      "Error closing patient bill. Kindly, if the error persists, contact the Administrator.";

    dispatch({
      type: POST_CLOSE_PATIENT_BILL_FAIL,
      payload: errorMessage,
    });

    throw new Error(errorMessage);
  }
};
