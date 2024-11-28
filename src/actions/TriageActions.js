import axios from "axios";

import { TRIAGE_VISIT_LIST_REQUEST, TRIAGE_VISIT_LIST_SUCCESS, TRIAGE_VISIT_LIST_FAIL } from "../constants/TriageConstants";
import useAuth from "../hooks/useAuth";

const API = "http://217.21.122.62:8085/";


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
              branchCode: branchCode
            },
      };
  
      const { data } = await axios.get(`${API}data/odatafilter?webservice=QyTriageList&isList=true`, config);
  
      dispatch({ type: TRIAGE_VISIT_LIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: TRIAGE_VISIT_LIST_FAIL, payload: error.message });
    }
  };