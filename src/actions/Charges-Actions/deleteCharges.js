import { message } from "antd";
import axios from "axios";

const API = "https://chiromo.potestastechnologies.net:8085/";

export const DELETE_CHARGES_REQUEST = "DELETE_CHARGES_REQUEST";
export const DELETE_CHARGES_SUCCESS = "DELETE_CHARGES_SUCCESS";
export const DELETE_CHARGES_FAIL = "DELETE_CHARGES_FAIL";
export const DELETE_CHARGES_RESET = "DELETE_CHARGES_RESET";

export const deletePatientCharges = (charges) => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_CHARGES_REQUEST });

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
        type: DELETE_CHARGES_SUCCESS,
        payload: response.data,
      });

      message.success(`Patient Charges removed successfully.`);

      // Return status for use in the view method
    } 
    return response.data.status;

  } catch (error) {
    dispatch({
      type: DELETE_CHARGES_FAIL,
      payload: error.response?.data?.message || error.errors || error.message,
    });

    message.error(error.response?.data?.message || error.errors || "Failed to post charges.");
    throw error;
  }
};

