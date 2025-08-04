import axios from "axios";
import { QY_LAB_TEST_LIST_REQUEST, QY_LAB_TEST_LIST_SUCCESS, QY_LAB_TEST_LIST_FAIL } from "../../constants/doc-constants/QySymptomConstants";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;
export const getLabRequestSetup = () => async (dispatch, getState) => { 
  try {
    dispatch({ type: QY_LAB_TEST_LIST_REQUEST });

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
      `${API}data/odatafilter?webservice=QyLabTestsSetup`,
      config
    );

    dispatch({ type: QY_LAB_TEST_LIST_SUCCESS, payload: data });

  } catch (error) {
    dispatch({ type: QY_LAB_TEST_LIST_FAIL, payload: error.message });
  }
  };