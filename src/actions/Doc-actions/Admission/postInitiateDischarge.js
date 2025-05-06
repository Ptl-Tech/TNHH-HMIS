import axios from "axios";
import { message } from "antd"; // Ensure message is imported

const API = "https://chiromo.potestastechnologies.net:8085/";

// Action Types
export const POST_INITIATE_PATIENT_DISCHARGE = "POST_INITIATE_PATIENT_DISCHARGE";
export const POST_INITIATE_PATIENT_DISCHARGE_SUCCESS = "POST_INITIATE_PATIENT_DISCHARGE_SUCCESS";
export const POST_INITIATE_PATIENT_DISCHARGE_FAIL = "POST_INITIATE_PATIENT_DISCHARGE_FAIL";
export const POST_INITIATE_PATIENT_DISCHARGE_RESET = "POST_INITIATE_PATIENT_DISCHARGE_RESET";

export const POST_INPATIENT_DISCHARGE = "POST_INPATIENT_DISCHARGE";
export const POST_INPATIENT_DISCHARGE_SUCCESS = "POST_INPATIENT_DISCHARGE_SUCCESS";
export const POST_INPATIENT_DISCHARGE_FAIL = "POST_INPATIENT_DISCHARGE_FAIL";
export const POST_INPATIENT_DISCHARGE_RESET = "POST_INPATIENT_DISCHARGE_RESET";

export const POST_PATIENT_SICK_OFF = "POST_PATIENT_SICK_OFF";
export const POST_PATIENT_SICK_OFF_SUCCESS = "POST_INPATIENT_PATIENT_SICK_OFF";
export const POST_PATIENT_SICK_OFF_FAIL = "POST_INPATIENT_SICK_OFF";
export const POST_PATIENT_SICK_OFF_RESET = "POST_INPATIENT_SICK_OFF";

export const GET_PATIENT_SICK_OFF = "GET_PATIENT_SICK_OFF";
export const GET_PATIENT_SICK_OFF_SUCCESS = "GET_INPATIENT_PATIENT_SICK_OFF";
export const GET_PATIENT_SICK_OFF_FAIL = "GET_INPATIENT_SICK_OFF";
export const GET_PATIENT_SICK_OFF_RESET = "GET_INPATIENT_SICK_OFF";

// Action to initiate patient discharge
export const postInitiatePatientDischarge = (admissionNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_INITIATE_PATIENT_DISCHARGE });

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

    const response = await axios.post(
      `${API}Inpatient/InitiateDischarge`,
      { admissionNo },
      config
    );

    const responseData = {
      status: response.data.status,
      data: response.data,
    };

    dispatch({
      type: POST_INITIATE_PATIENT_DISCHARGE_SUCCESS,
      payload: responseData,
    });

    return responseData.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "An error occurred";
    dispatch({
      type: POST_INITIATE_PATIENT_DISCHARGE_FAIL,
      payload: errorMessage,
    });
    message.error(errorMessage);
    throw error;
  }
};

// Action to complete inpatient discharge
export const postInpatientDischarge = (admissionNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_INPATIENT_DISCHARGE });

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

    const response = await axios.post(
      `${API}Inpatient/PostDischarge`,
      { admissionNo },
      config
    );

    const responseData = {
      status: response.data.status,
      data: response.data,
    };

    dispatch({
      type: POST_INPATIENT_DISCHARGE_SUCCESS,
      payload: responseData,
    });

    return responseData.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "An error occurred";
    dispatch({
      type: POST_INPATIENT_DISCHARGE_FAIL,
      payload: errorMessage,
    });
    message.error(errorMessage);
    throw error;
  }
};

export const postDischargeSummary = (admissionNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_INPATIENT_DISCHARGE });

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

    const response = await axios.post(
      `${API}Inpatient/PostDischarge`,
      { admissionNo },
      config
    );

    const responseData = {
      status: response.data.status,
      data: response.data,
    };

    dispatch({
      type: POST_INPATIENT_DISCHARGE_SUCCESS,
      payload: responseData,
    });

    return responseData.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "An error occurred";
    dispatch({
      type: POST_INPATIENT_DISCHARGE_FAIL,
      payload: errorMessage,
    });
    message.error(errorMessage);
    throw error;
  }
};

export const postSickOff = (formData) => async (dispatch, getState) => {

  try {
    dispatch({ type: POST_PATIENT_SICK_OFF });

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

    const response = await axios.post(
      `${API}Doctor/PostOffDutyDays`,
      formData,
      config
    );

    const responseData = {
      status: response.data.status,
      data: response.data,
    };

    dispatch({
      type: POST_PATIENT_SICK_OFF_SUCCESS,
      payload: responseData,
    });

    return responseData.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "An error occurred";
    dispatch({
      type: POST_PATIENT_SICK_OFF_FAIL,
      payload: errorMessage,
    });
    // message.error(errorMessage);
    throw error;
  }
};

export const getSickOff = (admissionNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_PATIENT_SICK_OFF });

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

    const response = await axios.get(
      `${API}data/odatafilter?webservice=PgInpatientDischargeLis&isList=true&query=$filter=AdmissionNo eq '${admissionNo}'`,
      config
    );

    const responseData = {
      status: response.data.status,
      data: response.data,
    };

    dispatch({
      type: GET_PATIENT_SICK_OFF_SUCCESS,
      payload: responseData,
    });

    return responseData.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "An error occurred";
    dispatch({
      type: GET_PATIENT_SICK_OFF_FAIL,
      payload: errorMessage,
    });
    // message.error(errorMessage);
    throw error;
  }
};