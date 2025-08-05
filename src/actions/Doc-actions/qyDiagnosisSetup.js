import axios from "axios";
import { QY_DIAGNOSIS_LIST_FAIL, QY_DIAGNOSIS_LIST_REQUEST, QY_DIAGNOSIS_LIST_SUCCESS } from "../../constants/doc-constants/QySymptomConstants";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;
export const getdiagnosisSetup = () => async (dispatch, getState) => { 
  try {
    dispatch({ type: QY_DIAGNOSIS_LIST_REQUEST });

    const {
      auth: { user }
    } = getState();
    
    const branchCode = user.branchCode;

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: user.staffNo, // Add staffNo as a custom header
         // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=QyDiagnosisSetup`,
      config
    );

    dispatch({ type: QY_DIAGNOSIS_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: QY_DIAGNOSIS_LIST_FAIL, payload: error.message });
  }
  };