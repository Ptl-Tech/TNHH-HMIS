import axios from "axios";
import { message } from "antd";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

// Action Types
export const GET_BILLING_LIST_REQUEST = "GET_BILLING_LIST_REQUEST";
export const GET_BILLING_LIST_SUCCESS = "GET_BILLING_LIST_SUCCESS";
export const GET_BILLING_LIST_FAIL = "GET_BILLING_LIST_FAIL";
export const GET_BILLING_LIST_RESET = "GET_BILLING_LIST_RESET";


export const GET_PATIENT_BILLING_LIST_REQUEST = "GET_PATIENT_BILLING_LIST_REQUEST";
export const GET_PATIENT_BILLING_LIST_SUCCESS = "GET_PATIENT_BILLING_LIST_SUCCESS";
export const GET_PATIENT_BILLING_LIST_FAIL = "GET_PATIENT_BILLING_LIST_FAIL";
export const GET_PATIENT_BILLING_LIST_RESET = "GET_PATIENT_BILLING_LIST_RESET";

export const GET_PAST_ENCOUNTER_BILLING_LIST_REQUEST = "GET_PAST_ENCOUNTER_BILLING_LIST_REQUEST";
export const GET_PAST_ENCOUNTER_BILLING_LIST_SUCCESS = "GET_PAST_ENCOUNTER_BILLING_LIST_SUCCESS";
export const GET_PAST_ENCOUNTER_BILLING_LIST_FAIL = "GET_PAST_ENCOUNTER_BILLING_LIST_FAIL";
export const GET_PAST_ENCOUNTER_BILLING_LIST_RESET = "GET_PAST_ENCOUNTER_BILLING_LIST_RESET";


// Action to fetch billing list
export const getBillingList = () => async (dispatch, getState) => {
  var query = `${API}data/odatafilter?webservice=PgPatientsList`;
  // query += active ? "&query=$filter=Activated eq true" : "";

  try {
    dispatch({ type: GET_BILLING_LIST_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();

    // Retrieve branch code from localStorage or fallback to empty string
    const branchCode = localStorage.getItem("branchCode") || "";

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo?.userData?.no || "",
        sessionToken: userInfo?.userData?.portalSessionToken || "",
        branchCode,
      },
    };

    const { data } = await axios.get(query, config);

    dispatch({
      type: GET_BILLING_LIST_SUCCESS,
      payload: data,
    });

    return data; // Return only filtered data
  } catch (error) {
    console.log({ error });

    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";

    dispatch({
      type: GET_BILLING_LIST_FAIL,
      payload: errorMessage,
    });

    message.error(errorMessage, 5);
    throw error;
  }
};

export const getPatientPastEncounterBilling=(patientNo)=>async(dispatch,getState)=>{
  try {
    dispatch({ type: GET_PATIENT_BILLING_LIST_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();

    // Retrieve branch code from localStorage or fallback to empty string
    const branchCode = localStorage.getItem("branchCode") || "";

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo?.userData?.no || "",
        sessionToken: userInfo?.userData?.portalSessionToken || "",
        branchCode,
      },
    };

    const { data } = await axios.get(
     `${API}data/odatafilter?webservice=QyPatientCharges&isList=true&query=$filter=Patient_No eq '${patientNo}'`,
      config
    );

    dispatch({
      type: GET_PATIENT_BILLING_LIST_SUCCESS,
      payload: data,
    });

    return data; // Return only filtered data
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";

    dispatch({
      type: GET_PATIENT_BILLING_LIST_FAIL,
      payload: errorMessage,
    });

    message.error(errorMessage, 5);
    throw error;
  }
}


export const getPastEncounterBillingList=(encounterId)=>async(dispatch,getState)=>{
  try {
    dispatch({ type: GET_PAST_ENCOUNTER_BILLING_LIST_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();

    // Retrieve branch code from localStorage or fallback to empty string
    const branchCode = localStorage.getItem("branchCode") || "";

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo?.userData?.no || "",
        sessionToken: userInfo?.userData?.portalSessionToken || "",
        branchCode,
      },
    };

    const { data } = await axios.get(
     `${API}PastEncounters/GetPastEncounterBilling?encounterId=${encounterId}`,
      config
    );

    const result={
      salesInvoices: data?.salesInvoices || [],
      receipts: data?.postedReceipts || [],
    }

    dispatch({
      type: GET_PAST_ENCOUNTER_BILLING_LIST_SUCCESS,
      payload: result,
    });

  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";

    dispatch({
      type: GET_PAST_ENCOUNTER_BILLING_LIST_FAIL,
      payload: errorMessage,
    });

    message.error(errorMessage, 5);
    throw error;
  }
}
