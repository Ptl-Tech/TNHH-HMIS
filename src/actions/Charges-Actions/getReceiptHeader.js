import axios from "axios";
import { message } from "antd"; // Import Ant Design message for error handling

const API = "http://217.21.122.62:8085/";

export const REQUEST_RECEIPT_HEADER = "REQUEST_RECEIPT_HEADER";
export const REQUEST_RECEIPT_HEADER_SUCCESS = "REQUEST_RECEIPT_HEADER_SUCCESS";
export const REQUEST_RECEIPT_HEADER_FAIL = "REQUEST_RECEIPT_HEADER_FAIL";
export const REQUEST_RECEIPT_HEADER_RESET = "REQUEST_RECEIPT_HEADER_RESET";

export const getReceiptHeader = (receiptNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_RECEIPT_HEADER });

    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem("branchCode");

    // Validate userInfo and branchCode for better error handling
    if (!userInfo || !branchCode) {
      throw new Error("User information or branch code is missing");
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
      `${API}data/odatafilter?webservice=PgReceiptHeaders&isList=true&query=$filter=No eq '${receiptNo}'`,
      config
    );

    dispatch({ type: REQUEST_RECEIPT_HEADER_SUCCESS, payload: response.data });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch receipt header";

    // Display error message using Ant Design's message component
    message.error(errorMessage);

    dispatch({ type: REQUEST_RECEIPT_HEADER_FAIL, payload: errorMessage });
  }
};
