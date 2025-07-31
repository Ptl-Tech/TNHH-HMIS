import axios from "axios";
import { message } from "antd";

const API = "https://chiromo.potestastechnologies.net:8091/";

export const REQUEST_INVOICE_LIST = "REQUEST_INVOICE_LIST";
export const REQUEST_INVOICE_LIST_SUCCESS = "REQUEST_INVOICE_LIST_SUCCESS";
export const REQUEST_INVOICE_LIST_FAIL = "REQUEST_INVOICE_LIST_FAIL";
export const REQUEST_INVOICE_LIST_RESET = "REQUEST_INVOICE_LIST_RESET";

export const getInvoiceList = (patientNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_INVOICE_LIST });

    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem("branchCode");

    // Handle missing userInfo or branchCode
    if (!userInfo || !branchCode) {
     window.location.href = "/login";
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
        `${API}data/odatafilter?webservice=PgPatientCharges&isList=true&query=$filter=Patient_No eq '${patientNo}'`,
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
