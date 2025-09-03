import axios from "axios";
import { message } from "antd";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const REQUEST_INVOICE_LIST = "REQUEST_INVOICE_LIST";
export const REQUEST_INVOICE_LIST_SUCCESS = "REQUEST_INVOICE_LIST_SUCCESS";
export const REQUEST_INVOICE_LIST_FAIL = "REQUEST_INVOICE_LIST_FAIL";
export const REQUEST_INVOICE_LIST_RESET = "REQUEST_INVOICE_LIST_RESET";


export const FETCH_UNPOSTED_INVOICE_LIST = "FETCH_UNPOSTED_INVOICE_LIST";
export const FETCH_UNPOSTED_INVOICE_SUCCESS = "FETCH_UNPOSTED_INVOICE_SUCCESS";
export const FETCH_UNPOSTED_INVOICE_LIST_FAIL = "FETCH_UNPOSTED_INVOICE_LIST_FAIL";
export const FETCH_UNPOSTED_INVOICE_RESET = "FETCH_UNPOSTED_INVOICE_RESET";


export const getInvoiceList = (activeVisitNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_INVOICE_LIST });

    const {
      auth: { user }
    } = getState();
    const branchCode = user.branchCode;

    
    if (!user|| !branchCode) {
     window.location.href = "/login";
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: user.staffNo,
        
        branchCode: branchCode,
      },
    };

    const response = await axios.get(
        `${API}data/odatafilter?webservice=PgPatientCharges&isList=true&query=$filter=VisitNo eq '${activeVisitNo}'`,
        config
    );

    dispatch({ type: REQUEST_INVOICE_LIST_SUCCESS, payload: response.data });
return response.data.status;

  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch Invoice header";

    message.error(errorMessage);
    dispatch({ type: REQUEST_INVOICE_LIST_FAIL, payload: errorMessage });
  }
};



export const getUnpostedInvoiceList = (activeVisitNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_UNPOSTED_INVOICE_LIST });

    const {
      auth: { user }
    } = getState();
    const branchCode = user.branchCode;

    
    if (!user|| !branchCode) {
     window.location.href = "/login";
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: user.staffNo,
        
        branchCode: branchCode,
      },
    };

    const response = await axios.get(
        `${API}data/odatafilter?webservice=QyUnpostedSalesInvoices&isList=true&query=$filter=AppointmentNo eq '${activeVisitNo}'`,
        config
    );

    dispatch({ type: FETCH_UNPOSTED_INVOICE_SUCCESS, payload: response.data });
return response.data.status;

  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch Invoice header";

    message.error(errorMessage);
    dispatch({ type: FETCH_UNPOSTED_INVOICE_LIST_FAIL, payload: errorMessage });
  }
};