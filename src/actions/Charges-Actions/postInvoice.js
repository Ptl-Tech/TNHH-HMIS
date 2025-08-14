import { message } from "antd";
import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const POST_SALES_INVOICE_REQUEST = "POST_SALES_INVOICE_REQUEST";
export const POST_SALES_INVOICE_SUCCESS = "POST_SALES_INVOICE_SUCCESS";
export const POST_SALES_INVOICE_FAIL = "POST_SALES_INVOICE_FAIL";
export const POST_SALES_INVOICE_RESET = "POST_SALES_INVOICE_RESET";

const postSalesInvoice = (invoice) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_SALES_INVOICE_REQUEST });
  
      const { auth: { user } } = getState();
      const branchCode = user.branchCode;
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          staffNo: user.staffNo,
          
          branchCode: branchCode,
        },
      };
  
       // API request
    const response = await axios.post(
        `${API}/GeneralProcesses/PostSalesInvoice`,
        invoice,
        config
      );
  
      const { status } = response.data;
  
      if (status === "success") {
        dispatch({
          type: POST_SALES_INVOICE_SUCCESS,
          payload: response.data,
        });
  
        message.success(`Patient Invoice posted successfully.`);
  
        // Return status for use in the view method
      } 
      return response.data.status;

    } catch (error) {
      dispatch({
        type: POST_SALES_INVOICE_FAIL,
        payload: error.response?.data?.message || error.errors || error.message,
      });
  
      message.error(error.response?.data?.message || error.errors || "Failed to post charges.");
      throw error;
    }
  };

  export { postSalesInvoice };

