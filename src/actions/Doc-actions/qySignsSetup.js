import axios from "axios";
import { QY_SIGNS_LIST_REQUEST, QY_SIGNS_LIST_SUCCESS, QY_SIGNS_LIST_FAIL } from "../../constants/doc-constants/QySymptomConstants";

const API = "http://217.21.122.62:8085/";
export const getSignsSetup = () => async (dispatch, getState) => { 
  try {
    dispatch({ type: QY_SIGNS_LIST_REQUEST });

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
      `${API}data/odatafilter?webservice=QySignsSetup`,
      config
    );

    dispatch({ type: QY_SIGNS_LIST_SUCCESS, payload: data });

    console.log("data: ", data);
  } catch (error) {
    dispatch({ type: QY_SIGNS_LIST_FAIL, payload: error.message });
  }
  };