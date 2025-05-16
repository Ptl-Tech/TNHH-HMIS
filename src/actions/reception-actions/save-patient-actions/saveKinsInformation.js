import axios from "axios";

const API = "https://chiromo.potestastechnologies.net:8085/";


export const SAVE_KINS_INFORMATION_REQUEST = "SAVE_KINS_INFORMATION_REQUEST";
export const SAVE_KINS_INFORMATION_SUCCESS = "SAVE_KINS_INFORMATION_SUCCESS";
export const SAVE_KINS_INFORMATION_FAIL = "SAVE_KINS_INFORMATION_FAIL";
export const SAVE_KINS_INFORMATION_RESET = "SAVE_KINS_INFORMATION_RESET";

export const saveKinsInformation = (formData, navigate) => async (dispatch, getState) => {
  try {
    dispatch({ type: SAVE_KINS_INFORMATION_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();

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
      `${API}Reception/PatientDataNextOfKin`,
      formattedData,
      config
    );

    dispatch({ type: SAVE_KINS_INFORMATION_SUCCESS, payload: response.data });

    return response.data;
  } catch (error) {
    dispatch({
      type: SAVE_KINS_INFORMATION_FAIL,
      payload: error.response?.data?.errors || "An error occurred while saving.",
    });

    throw new Error(error.response?.data?.errors || "An error occurred while saving.");
  }
}