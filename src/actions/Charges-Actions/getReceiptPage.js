import axios from "axios";
import { message } from "antd";

const API = "https://chiromo.potestastechnologies.net:8085/";

export const REQUEST_RECEIPT_PAGE = "REQUEST_RECEIPT_PAGE";
export const REQUEST_RECEIPT_PAGE_SUCCESS = "REQUEST_RECEIPT_PAGE_SUCCESS";
export const REQUEST_RECEIPT_PAGE_FAIL = "REQUEST_RECEIPT_PAGE_FAIL";
export const REQUEST_RECEIPT_PAGE_RESET = "REQUEST_RECEIPT_PAGE_RESET";

export const getReceiptPage = (visitNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_RECEIPT_PAGE });

    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem("branchCode");

    // Handle missing userInfo or branchCode
    if (!userInfo || !branchCode) {
      const errorMsg = "User information or branch code is missing";
      dispatch({ type: REQUEST_RECEIPT_PAGE_FAIL, payload: errorMsg });
      message.error(errorMsg);
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no,
        sessionToken: userInfo.userData.portalSessionToken,
        branchCode: branchCode,
      },
    };

    const response = await axios.get(
      `${API}data/odatafilter?webservice=PgReceiptHeaders&isList=true&query=$filter=Patient_Appointment_No eq '${visitNo}'`,
      config
    );


    dispatch({ type: REQUEST_RECEIPT_PAGE_SUCCESS, payload: response.data });
    return response.data.status;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch receipt header";

    message.error(errorMessage);
    dispatch({ type: REQUEST_RECEIPT_PAGE_FAIL, payload: errorMessage });
  }
};
