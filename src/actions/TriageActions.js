import axios from "axios";

import {
  TRIAGE_VISIT_LIST_REQUEST,
  TRIAGE_VISIT_LIST_SUCCESS,
  TRIAGE_VISIT_LIST_FAIL,
} from "../constants/TriageConstants";
import {
  POST_TRIAGE_VISIT_REQUEST,
  POST_TRIAGE_VISIT_SUCCESS,
  POST_TRIAGE_VISIT_FAIL,
} from "../constants/patientConstants";

export const TriageWaitingList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: TRIAGE_VISIT_LIST_REQUEST });

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
      `${API}data/odatafilter?webservice=QyTriageList&isList=true`,
      config
    );

    dispatch({ type: TRIAGE_VISIT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: TRIAGE_VISIT_LIST_FAIL, payload: error.message });
  }
};

export const DispatchToTriage = (visitNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_TRIAGE_VISIT_REQUEST });

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

    const { data } = await axios.post(
      `${API}Reception/DispatchToTriage`,
      visitNo,
      config
    );

    // Dispatch success action
    dispatch({ type: POST_TRIAGE_VISIT_SUCCESS, payload: responseData });
  } catch (error) {
    dispatch({ type: POST_TRIAGE_VISIT_FAIL, payload: error.message });
  }
};
