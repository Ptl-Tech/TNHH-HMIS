import axios from "axios";
import { message } from "antd"; // Import Ant Design message for error handling

const API = "https://chiromo.potestastechnologies.net:8091/";

export const REQUEST_PATIENT_RECEIPT_LINES = "REQUEST_PATIENT_PATIENT_RECEIPT_LINES";
export const REQUEST_PATIENT_RECEIPT_LINES_SUCCESS = "REQUEST_PATIENT_RECEIPT_LINES_SUCCESS";
export const REQUEST_PATIENT_RECEIPT_LINES_FAIL = "REQUEST_PATIENT_RECEIPT_LINES_FAIL";
export const REQUEST_PATIENT_RECEIPT_LINES_RESET = "REQUEST_PATIENT_RECEIPT_LINES_RESET";


export const REQUEST__PATIENT_RECEIPT_HEADER = "REQUEST__PATIENT_RECEIPT_HEADER";
export const REQUEST__PATIENT_RECEIPT_HEADER_SUCCESS = "REQUEST__PATIENT_RECEIPT_HEADER_SUCCESS";
export const REQUEST__PATIENT_RECEIPT_HEADER_FAIL = "REQUEST__PATIENT_RECEIPT_HEADER_FAIL";
export const REQUEST__PATIENT_RECEIPT_HEADER_RESET = "REQUEST__PATIENT_RECEIPT_HEADER_RESET";

export const getPatientReceiptLines = (visitNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_PATIENT_RECEIPT_LINES });

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
      `${API}data/odatafilter?webservice=PgReceiptLines&isList=true&query=$filter=TellerID eq '${visitNo}'`,
      config
    );

    dispatch({ type: REQUEST_PATIENT_RECEIPT_LINES_SUCCESS, payload: response.data });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.errors || "Failed to fetch PATIENT_RECEIPT lines";

    // Display error message using Ant Design's message component
    message.error(errorMessage);

    dispatch({ type: REQUEST_PATIENT_RECEIPT_LINES_FAIL, payload: errorMessage });
  }
};


export const getPatientReceiptHeader = (visitNo) => async (dispatch, getState) => {
    try {
      dispatch({ type: REQUEST__PATIENT_RECEIPT_HEADER });
  
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
        `${API}data/odatafilter?webservice=PgReceiptsListPage&isList=true&query=$filter=Patient_Appointment_No eq '${visitNo}'`,
        config
      );
  
      dispatch({ type: REQUEST__PATIENT_RECEIPT_HEADER_SUCCESS, payload: response.data });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch PATIENT_RECEIPT lines";
  
      // Display error message using Ant Design's message component
      message.error(errorMessage);
  
      dispatch({ type: REQUEST__PATIENT_RECEIPT_HEADER_FAIL, payload: errorMessage });
    }
  };