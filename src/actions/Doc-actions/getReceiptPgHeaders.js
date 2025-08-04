import axios from "axios";
import { message } from "antd";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

// Action Types
export const GET_RECEIPT_HEADERS_REQUEST = "GET_RECEIPT_HEADERS_REQUEST";
export const GET_RECEIPT_HEADERS_SUCCESS = "GET_RECEIPT_HEADERS_SUCCESS";
export const GET_RECEIPT_HEADERS_FAIL = "GET_RECEIPT_HEADERS_FAIL";
export const GET_RECEIPT_HEADERS_RESET = "GET_RECEIPT_HEADERS_RESET";
// Action to fetch lab list



export const getReceiptHeaders= () => async (dispatch, getState) => {
    try {
      dispatch({ type: GET_RECEIPT_HEADERS_REQUEST });
  
      const {
        otpVerify: { userInfo },
      } = getState();
  
      const branchCode = localStorage.getItem("branchCode");
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          staffNo: userInfo.userData.no,
          sessionToken: userInfo.userData.portalSessionToken,
          branchCode: branchCode,
        },
      };
  
      const { data } = await axios.get(
        `${API}data/odatafilter?webservice=PgReceiptHeaders&isList=true`,
        config
      );
      console.log(data)
  
      dispatch({ type: GET_RECEIPT_HEADERS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: GET_RECEIPT_HEADERS_FAIL, payload: error.message });
    }
  };
  

