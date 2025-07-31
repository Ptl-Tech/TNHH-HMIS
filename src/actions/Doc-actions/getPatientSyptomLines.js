import axios from "axios";
import { message } from "antd";

const API = "https://chiromo.potestastechnologies.net:8091/";

// Action Types
export const GET_PATIENT_SYPTOM_LINES_REQUEST = "GET_PATIENT_SYPTOM_LINES_REQUEST";
export const GET_PATIENT_SYPTOM_LINES_SUCCESS = "GET_PATIENT_SYPTOM_LINES_SUCCESS";
export const GET_PATIENT_SYPTOM_LINES_FAIL = "GET_PATIENT_SYPTOM_LINES_FAIL";
export const GET_PATIENT_SYPTOM_LINES_RESET = "GET_PATIENT_SYPTOM_LINES_RESET";
// Action to fetch lab list



export const getPatientSyptomLines = () => async (dispatch, getState) => {
    try {
      dispatch({ type: GET_PATIENT_SYPTOM_LINES_REQUEST });
  
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
        `${API}data/odatafilter?webservice=QyObservationSymptoms&isList=true`,
        config
      );
  
      dispatch({ type: GET_PATIENT_SYPTOM_LINES_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: GET_PATIENT_SYPTOM_LINES_FAIL, payload: error.message });
    }
  };
  

