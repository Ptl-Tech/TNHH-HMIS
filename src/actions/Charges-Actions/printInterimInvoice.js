import axios from "axios";
import apiHeaderConfig from "../configHelpers";
import { message } from "antd";

export const PRINT_INTERIM_INVOICE_REQUEST = "PRINT_INTERIM_INVOICE_REQUEST";
export const PRINT_INTERIM_INVOICE_SUCCESS = "PRINT_INTERIM_INVOICE_SUCCESS";
export const PRINT_INTERIM_INVOICE_FAIL = "PRINT_INTERIM_INVOICE_FAIL";
export const PRINT_INTERIM_INVOICE_RESET = "PRINT_INTERIM_INVOICE_RESET";

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL || "http://217.21.122.62:8085";

export const postInterimInvoice = (invoiceData, staffNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRINT_INTERIM_INVOICE_REQUEST });

    // Append staffNo to invoiceData
    const postDataInvoice = { ...invoiceData, staffNo };

    const config = apiHeaderConfig(getState);
    const response = await axios.post(
      `${API_URL}/Reports/PatientInterimInvoice`,
      postDataInvoice,
      config
    );      

    dispatch({
      type: PRINT_INTERIM_INVOICE_SUCCESS,
      payload: response.data,
    });
    message.success("Invoice printed successfully!", 5);
    return response.data;
  } catch (error) {
    setTimeout(() => {
      dispatch({
        type: PRINT_INTERIM_INVOICE_FAIL,
        payload: error.response?.data?.errors || error.errors,
      });
      message.error(error.response?.data?.errors || error.errors);
    }, 1200);
  } finally {
    dispatch({ type: PRINT_INTERIM_INVOICE_RESET });
  }
};
