import axios from "axios";
import { message } from "antd"; // Import Ant Design message for error handling

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const REQUEST_SPLIT_LINES = "REQUEST_SPLIT_LINES";
export const REQUEST_SPLIT_LINES_SUCCESS = "REQUEST_SPLIT_LINES_SUCCESS";
export const REQUEST_SPLIT_LINES_FAIL = "REQUEST_SPLIT_LINES_FAIL";
export const REQUEST_SPLIT_LINES_RESET = "REQUEST_SPLIT_LINES_RESET";

export const getSplitReceiptLines = (receiptNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_SPLIT_LINES });

    const {
      auth: { user }
    } = getState();
    const branchCode = user.branchCode;

    
    if (!user|| !branchCode) {
      throw new Error("User information or branch code is missing");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: user.staffNo,
        
        branchCode: branchCode,
      },
    };

    const {data} = await axios.get(
      `${API}data/odatafilter?webservice=QyReceiptSplitList&isList=true&query=$filter=ReceiptNo eq '${receiptNo}'`,
      config
    );

    dispatch({ type: REQUEST_SPLIT_LINES_SUCCESS, payload: data});
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch receipt lines";

    // Display error message using Ant Design's message component
    message.error(errorMessage);

    dispatch({ type: REQUEST_SPLIT_LINES_FAIL, payload: errorMessage });
  }
};
