import axios from "axios";
import { message } from "antd";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const REQUEST_RECEIPT_HEADER = "REQUEST_RECEIPT_HEADER";
export const REQUEST_RECEIPT_HEADER_SUCCESS = "REQUEST_RECEIPT_HEADER_SUCCESS";
export const REQUEST_RECEIPT_HEADER_FAIL = "REQUEST_RECEIPT_HEADER_FAIL";
export const REQUEST_RECEIPT_HEADER_RESET = "REQUEST_RECEIPT_HEADER_RESET";

export const getReceiptHeader = (visitNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_RECEIPT_HEADER });

    const {
      auth: { user }
    } = getState();
    const branchCode = user.branchCode;

    
    if (!user|| !branchCode) {
      const errorMsg = "User information or branch code is missing";
      dispatch({ type: REQUEST_RECEIPT_HEADER_FAIL, payload: errorMsg });
      message.error(errorMsg);
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
      `${API}data/odatafilter?webservice=PgReceiptsListPage&isList=true&query=$filter=Patient_Appointment_No eq '${visitNo}'`,
      config
    );

 

    dispatch({ type: REQUEST_RECEIPT_HEADER_SUCCESS, payload: response.data });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch receipt header";

    message.error(errorMessage);
    dispatch({ type: REQUEST_RECEIPT_HEADER_FAIL, payload: errorMessage });
  }
};
