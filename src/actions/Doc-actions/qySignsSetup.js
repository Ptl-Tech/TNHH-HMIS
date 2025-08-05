import axios from "axios";
import { QY_SIGNS_LIST_REQUEST, QY_SIGNS_LIST_SUCCESS, QY_SIGNS_LIST_FAIL } from "../../constants/doc-constants/QySymptomConstants";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;
export const getSignsSetup = () => async (dispatch, getState) => { 
  try {
    dispatch({ type: QY_SIGNS_LIST_REQUEST });

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
      `${API}data/odatafilter?webservice=QySignsSetup`,
      config
    );

    dispatch({ type: QY_SIGNS_LIST_SUCCESS, payload: data });

    console.log("data: ", data);
  } catch (error) {
    dispatch({ type: QY_SIGNS_LIST_FAIL, payload: error.message });
  }
  };