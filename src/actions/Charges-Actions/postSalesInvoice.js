import { message } from "antd";
import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const POST_SALES_INVOICE_REQUEST = "POST_SALES_INVOICE_REQUEST";
export const POST_SALES_INVOICE_SUCCESS = "POST_SALES_INVOICE_SUCCESS";
export const POST_SALES_INVOICE_FAIL = "POST_SALES_INVOICE_FAIL";
export const POST_SALES_INVOICE_RESET = "POST_SALES_INVOICE_RESET";
export const postsalesInvoice = (invoice) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_SALES_INVOICE_REQUEST });

    const {
      auth: { user }
    } = getState();
    const branchCode = user.branchCode;

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: user.staffNo,
        
        branchCode: branchCode,
      },
    };

    const response = await axios.post(
      `${API}GeneralProcesses/PostSalesInvoice`,
      invoice,
      config
    );

    // Extract response details
    const responseData = {
      status: response.data.status,
    };

    

    dispatch({ type: POST_SALES_INVOICE_SUCCESS, payload: response });
    return responseData.status;
  } catch (error) {
    // Extract error message from different possible sources
    const errorMessage =
      error.response?.data?.errors || 
      "Failed to dispatch patient!";

    message.error(errorMessage, 5);

    dispatch({
      type: POST_SALES_INVOICE_FAIL,
      payload: errorMessage,
    });

    throw error;
  }
};
