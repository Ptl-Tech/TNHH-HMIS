import axios from "axios";
import { message, Modal } from "antd";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const POST_DIAGNOSIS_REQUEST = "POST_DIAGNOSIS_REQUEST";
export const POST_DIAGNOSIS_SUCCESS = "POST_DIAGNOSIS_SUCCESS";
export const POST_DIAGNOSIS_FAIL = "POST_DIAGNOSIS_FAIL";

export const postDiagnosisRequest = (Diagnosis) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_DIAGNOSIS_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    const response = await axios.post(
      `${API}Doctor/PatientDiagnosis`,
      Diagnosis,
      config
    );

    const responseData = {
      status: response.data.status,
      data: response.data,
    };

    setTimeout(() => {
      dispatch({ type: POST_DIAGNOSIS_SUCCESS, payload: responseData });
    }, 2000);

    
    return responseData.data; // `msg` contains the patient ID
  } catch (error) {
    dispatch({
      type: POST_DIAGNOSIS_FAIL,
      payload: error.response?.data?.message || error.message,
    });

    
    throw error; // Rethrow error for `handleSubmit` to handle
  }
};
