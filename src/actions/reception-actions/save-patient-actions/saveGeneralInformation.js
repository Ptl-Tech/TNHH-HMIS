import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://chiromo.potestastechnologies.net:8085/";

export const SAVE_GENERAL_INFORMATION_REQUEST = "SAVE_GENERAL_INFORMATION_REQUEST";
export const SAVE_GENERAL_INFORMATION_SUCCESS = "SAVE_GENERAL_INFORMATION_SUCCESS";
export const SAVE_GENERAL_INFORMATION_FAIL = "SAVE_GENERAL_INFORMATION_FAIL";
export const SAVE_GENERAL_INFORMATION_RESET = "SAVE_GENERAL_INFORMATION_RESET";

// Save patient general information
export const saveGeneralInformation = (formData, navigate) => async (dispatch, getState) => {
  try {
    dispatch({ type: SAVE_GENERAL_INFORMATION_REQUEST });

    const { otpVerify: { userInfo } } = getState();

    if (!userInfo || !userInfo.userData) {
      navigate("/login"); // Redirect to login
      throw new Error("User information not available.");
    }

    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Staff number
        sessionToken: userInfo.userData.portalSessionToken, // Session token
        branchCode: branchCode, // Branch Code
      },
    };

    const formattedData = {
      ...formData,
      branchCode: branchCode,
    };

    const response = await axios.post(
      `${API}Reception/PatientRegistration`,
      formattedData,
      config
    );

    // Extract patient number safely
    const patientNo = response.data.patientNo || response.data.patient?.patientNo || null;

    if (!patientNo) {
      throw new Error("Patient number not found in the response.");
    }

    dispatch({ type: SAVE_GENERAL_INFORMATION_SUCCESS, payload: { ...response.data, patientNo } });

    return { patientNo }; // Return the patient number for further use
  } catch (error) {
    dispatch({
      type: SAVE_GENERAL_INFORMATION_FAIL,
      payload: error.response?.data?.errors || "An error occurred while saving.",
    });

    throw error;
  }
};
