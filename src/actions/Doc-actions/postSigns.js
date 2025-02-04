import { message } from "antd";
import axios from "axios";

const API = "https://chiromo.potestastechnologies.net:8085/";

export const POST_SIGNS_REQUEST = "POST_SIGNS_REQUEST";
export const POST_SIGNS_SUCCESS = "POST_SIGNS_SUCCESS";
export const POST_SIGNS_FAIL = "POST_SIGNS_FAIL";

export const postSignsRequest = (signs) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_SIGNS_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Staff number
        sessionToken: userInfo.userData.portalSessionToken, // Session token
        branchCode: branchCode, // Branch code
      },
    };

    const response = await axios.post(
      `${API}Doctor/PatientSigns`,
      signs,
      config
    );

    // Extract response details
    const responseData = {
      status: response.data.status,
      data: response.data, // Assuming response.data contains the required information
    };

    setTimeout(() => {
      dispatch({ type: POST_SIGNS_SUCCESS, payload: responseData });
      message.success("Signs posted Successfully", 2);
    }, 2000);

    // Return response data for further use
    return responseData.data;
  } catch (error) {
   setTimeout(() => {
    dispatch({
      type: POST_SIGNS_FAIL,
      payload: error.response?.data?.message || error.errors,
    });
    message.error(error.response?.data?.errors || error.errors);
   }, 2000);
    throw error; // Rethrow error for further handling
  }
};
