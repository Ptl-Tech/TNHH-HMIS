import axios from "axios";
import { message } from "antd";

const API = "https://chiromo.potestastechnologies.net:8085/";

export const REQUEST_RECEIPT_HEADER = "REQUEST_RECEIPT_HEADER";
export const REQUEST_RECEIPT_HEADER_SUCCESS = "REQUEST_RECEIPT_HEADER_SUCCESS";
export const REQUEST_RECEIPT_HEADER_FAIL = "REQUEST_RECEIPT_HEADER_FAIL";
export const REQUEST_RECEIPT_HEADER_RESET = "REQUEST_RECEIPT_HEADER_RESET";

export const getReceiptHeader = (visitNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_RECEIPT_HEADER });

    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem("branchCode");

    // Handle missing userInfo or branchCode
    if (!userInfo || !branchCode) {
      const errorMsg = "User information or branch code is missing";
      dispatch({ type: REQUEST_RECEIPT_HEADER_FAIL, payload: errorMsg });
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
      `${API}data/odatafilter?webservice=PgReceiptsListPage&isList=true&query=$filter=Patient_Appointment_No eq '${visitNo}'`,
      config
    );

    // Ensure response.data is valid
    if (!response.data || response.data.length === 0) {
      const emptyMsg = "No receipt header found";
      dispatch({ type: REQUEST_RECEIPT_HEADER_FAIL, payload: emptyMsg });
      message.warning(emptyMsg);
      return;
    }

    dispatch({ type: REQUEST_RECEIPT_HEADER_SUCCESS, payload: response.data });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch receipt header";

    message.error(errorMessage);
    dispatch({ type: REQUEST_RECEIPT_HEADER_FAIL, payload: errorMessage });
  }
};
