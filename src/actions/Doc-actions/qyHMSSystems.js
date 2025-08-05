import axios from "axios";
import { QY_HMS_LIST_REQUEST, QY_HMS_LIST_SUCCESS, QY_HMS_LIST_FAIL } from "../../constants/doc-constants/QySymptomConstants";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;
export const getHMSsetup = () => async (dispatch, getState) => { 
  try {
    dispatch({ type: QY_HMS_LIST_REQUEST });

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
      `${API}data/odatafilter?webservice=QyHMSSystems`,
      config
    );

    dispatch({ type: QY_HMS_LIST_SUCCESS, payload: data });

    console.log("data: ", data);
  } catch (error) {
    dispatch({ type: QY_HMS_LIST_FAIL, payload: error.message });
  }
  };