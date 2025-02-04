import axios from "axios";

const API = "https://chiromo.potestastechnologies.net:8085/";

export const QY_HOS_NO_REQUEST = "QY_HOS_NO_REQUEST";
export const QY_HOS_NO_SUCCESS = "QY_HOS_NO_SUCCESS";
export const QY_HOS_NO_FAIL = "QY_HOS_NO_FAIL";
export const QY_HOS_NO_RESET = "QY_HOS_NO_RESET";
export const getHospitalNumber = () => async (dispatch, getState) => { 
  try {
    dispatch({ type: QY_HOS_NO_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();
    // Fetch branchCode from localStorage
    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=QyVendors`,
      config
    );

    dispatch({ type: QY_HOS_NO_SUCCESS, payload: data });

    console.log("data: ", data);
  } catch (error) {
    dispatch({ type: QY_HOS_NO_FAIL, payload: error.message });
  }
  };