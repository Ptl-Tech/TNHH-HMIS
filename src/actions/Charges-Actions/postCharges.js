import { message } from "antd";
import axios from "axios";

const API = "https://chiromo.potestastechnologies.net:8091/";

export const POST_CHARGES_REQUEST = "POST_CHARGES_REQUEST";
export const POST_CHARGES_SUCCESS = "POST_CHARGES_SUCCESS";
export const POST_CHARGES_FAIL = "POST_CHARGES_FAIL";
export const POST_CHARGES_RESET = "POST_CHARGES_RESET";

export const postPatientCharges = (charges) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_CHARGES_REQUEST });

    const { otpVerify: { userInfo } } = getState();
    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no,
        sessionToken: userInfo.userData.portalSessionToken,
        branchCode: branchCode,
      },
    };

    // API request
    const response = await axios.post(
      `${API}GeneralProcesses/PatientCharges`,
      charges,
      config
    );

    const { status } = response.data;

    if (status === "success") {
      dispatch({
        type: POST_CHARGES_SUCCESS,
        payload: response.data,
      });

      message.success(`Patient Charges saved successfully.`);

      // Return status for use in the view method
    } 
    return response.data.status;

  } catch (error) {
    dispatch({
      type: POST_CHARGES_FAIL,
      payload: error.response?.data?.errors ,
    });

    message.error(error.response?.data?.errors || "Failed to post charges.");
    throw error;
  }
};

