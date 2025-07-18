import axios from "axios";
import { message } from "antd";

const API = "https://chiromo.potestastechnologies.net:8085/";

export const REQUEST_RECEIPTS_LIST = "REQUEST_RECEIPTS_LIST";
export const REQUEST_RECEIPTS_LIST_SUCCESS = "REQUEST_RECEIPTS_LIST_SUCCESS";
export const REQUEST_RECEIPT_LIST_FAIL = "REQUEST_RECEIPT_LIST_FAIL";
export const REQUEST_RECEIPTS_LIST_RESET = "REQUEST_RECEIPTS_LIST_RESET";

export const REQUEST_RECEIPTS_LIST_BY_PATIENT_NO = "REQUEST_RECEIPTS_LIST_BY_PATIENT_NO ";
export const REQUEST_RECEIPTS_LIST_SUCCESS_BY_PATIENT_NO  = "REQUEST_RECEIPTS_LIST_SUCCESS_BY_PATIENT_NO ";
export const REQUEST_RECEIPT_LIST_FAIL_BY_PATIENT_NO  = "REQUEST_RECEIPT_LIST_FAIL_BY_PATIENT_NO ";
export const REQUEST_RECEIPTS_LIST_RESET_BY_PATIENT_NO  = "REQUEST_RECEIPTS_LIST_RESET_BY_PATIENT_NO ";

export const getReceipts = () => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_RECEIPTS_LIST });

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
      `${API}data/odatafilter?webservice=PgReceiptHeaders&isList=true`,
      config
    );

    dispatch({ type: REQUEST_RECEIPTS_LIST_SUCCESS, payload: response.data });
    return response.data.status;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch receipt header";

    message.error(errorMessage);
    dispatch({ type: REQUEST_RECEIPT_LIST_FAIL, payload: errorMessage });
  }
};

export const getReceiptsByPatientNo =
  (patientNo) => async (dispatch, getState) => {
    try {
      dispatch({ type: REQUEST_RECEIPTS_LIST_BY_PATIENT_NO });

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

      const {data} = await axios.get(
        `${API}data/odatafilter?webservice=PgReceiptHeaders&isList=true&query=$filter=Patient_No=${patientNo}`,
        config
      );

      dispatch({ type: REQUEST_RECEIPTS_LIST_SUCCESS_BY_PATIENT_NO, payload: data });
      return data.status;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch receipt header";

      message.error(errorMessage);
      dispatch({ type: REQUEST_RECEIPT_LIST_FAIL_BY_PATIENT_NO, payload: errorMessage });
    }
  };
