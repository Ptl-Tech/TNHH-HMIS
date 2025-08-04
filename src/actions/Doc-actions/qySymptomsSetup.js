import axios from "axios";
import { QY_SYMPTOMS_LIST_REQUEST, QY_SYMPTOMS_LIST_SUCCESS, QY_SYMPTOMS_LIST_FAIL } from "../../constants/doc-constants/QySymptomConstants";

const API = "https://chiromo.potestastechnologies.net:8091/";
export const getSymptomsRequest = () => async (dispatch, getState) => { 
  try {
    dispatch({ type: QY_SYMPTOMS_LIST_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();
    // Fetch branchCode from localStorage
    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=QySymptomsSetup`,
      config
    );

    dispatch({ type: QY_SYMPTOMS_LIST_SUCCESS, payload: data });

    console.log("data: ", data);
  } catch (error) {
    dispatch({ type: QY_SYMPTOMS_LIST_FAIL, payload: error.message });
  }
  };