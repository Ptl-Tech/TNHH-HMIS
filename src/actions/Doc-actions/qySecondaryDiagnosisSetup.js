import axios from "axios";
const API = "https://chiromo.potestastechnologies.net:8091/";

export const QY_SECONDARY_DIAGNOSIS_SETUP = "QY_SECONDARY_DIAGNOSIS_SETUP";
export const QY_SECONDARY_DIAGNOSIS_SETUP_SUCCESS = "QY_SECONDARY_DIAGNOSIS_SETUP_SUCCESS";
export const QY_SECONDARY_DIAGNOSIS_SETUP_FAIL = "QY_SECONDARY_DIAGNOSIS_SETUP_FAIL";
export const QY_SECONDARY_DIAGNOSIS_SETUP_RESET = "QY_SECONDARY_DIAGNOSIS_SETUP_RESET";


export const getSecondaryDiagnosisSetup = () => async (dispatch, getState) => {
  try {
    dispatch({ type: QY_SECONDARY_DIAGNOSIS_SETUP });

    const {
      otpVerify: { userInfo },
    } = getState();

    // Fetch branchCode from localStorage
    const branchCode = localStorage.getItem("branchCode");
    if (!branchCode) throw new Error("Branch code not found in local storage.");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=QySecondaryDiagnosisSetup`,
      config
    );

    dispatch({ type: QY_SECONDARY_DIAGNOSIS_SETUP_SUCCESS, payload: data });

    console.log("Fetched data: ", data); // Remove this in production
  } catch (error) {
    dispatch({
      type: QY_SECONDARY_DIAGNOSIS_SETUP_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
