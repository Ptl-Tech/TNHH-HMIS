import axios from "axios";
import apiHeaderConfig from "../configHelpers";
import { message } from "antd";

export const PRINT_RECEIPT_REQUEST = "PRINT_RECEIPT_REQUEST";
export const PRINT_RECEIPT_SUCCESS = "PRINT_RECEIPT_SUCCESS";
export const PRINT_RECEIPT_FAIL = "PRINT_RECEIPT_FAIL";
export const PRINT_RECEIPT_RESET = "PRINT_RECEIPT_RESET";

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL ;

export const printReceipt = (invoiceData) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRINT_RECEIPT_REQUEST });

    // Append staffNo to invoiceData

    const config = apiHeaderConfig(getState);

    //get staffNo from userInfo
    const {
      otpVerify: { userInfo },
    } = getState();
    invoiceData.staffNo = userInfo.userData.no;

    const response = await axios.post(
      `${API_URL}/Reports/ReceiptReport`,
      invoiceData,
      config
    );      

    dispatch({
      type: PRINT_RECEIPT_SUCCESS,
      payload: response,
    });
    return response;
  } catch (error) {
    dispatch({
      type: PRINT_RECEIPT_FAIL,
      payload: error.response?.data?.errors || error.errors,
    });
    message.error(error.response?.data?.errors || error.errors);
  } finally {
    dispatch({ type: PRINT_RECEIPT_RESET });
  }
};
