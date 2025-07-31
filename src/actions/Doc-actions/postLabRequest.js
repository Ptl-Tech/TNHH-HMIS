
import { message } from "antd";
import axios from "axios";

const API = "https://chiromo.potestastechnologies.net:8091/";


export const POST_LAB_REQUEST = "POST_LAB_REQUEST";
export const POST_LAB_SUCCESS = "POST_LAB_SUCCESS";
export const POST_LAB_FAIL = "POST_LAB_FAIL";
export const postLabRequest = (labRequest) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_LAB_REQUEST });

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
      `${API}Doctor/PatientLaboratory`,
      labRequest,
      config
    );

    // Extract response details
    const responseData = {
      status: response.data.status,
      data: response.data, // Assuming `msg` contains the patient ID
    };

    dispatch({ type: POST_LAB_SUCCESS, payload: responseData });

    // Return patient ID for further use
    return responseData.data; // `msg` contains the patient ID
  } catch (error) {
    setTimeout(() => {
      dispatch({
        type: POST_LAB_FAIL,
        payload: error.response?.data?.message || error.errors,
      });
      message.error(error.response?.data?.errors || error.errors);
    }
      , 1200);
    throw error; // Rethrow error for `handleSubmit` to handle
  }
};
