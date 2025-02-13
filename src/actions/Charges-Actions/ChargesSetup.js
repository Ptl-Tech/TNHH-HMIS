import axios from "axios";

const API = "https://chiromo.potestastechnologies.net:8085/";

export const GET_CHARGES_SETUP_REQUEST = "GET_CHARGES_SETUP_REQUEST";
export const GET_CHARGES_SETUP_SUCCESS = "GET_CHARGES_SETUP_SUCCESS";
export const GET_CHARGES_SETUP_FAIL = "GET_CHARGES_SETUP_FAIL";
export const GET_CHARGES_SETUP_RESET = "GET_CHARGES_SETUP_RESET";

export const getChargesSetup = () => async (dispatch, getState) => { 
  try {
    dispatch({ type: GET_CHARGES_SETUP_REQUEST });

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
      `${API}data/odatafilter?webservice=PgChargesSetups`,
      config
    );

    dispatch({ type: GET_CHARGES_SETUP_SUCCESS, payload: data });

  } catch (error) {
    // Check if it's an axios error
    const errorMessage = error.response
      ? error.response.data.message || error.response.statusText
      : error.message;
    
    dispatch({ type: GET_CHARGES_SETUP_FAIL, payload: errorMessage });
  }
};
