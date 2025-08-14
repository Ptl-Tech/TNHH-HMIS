import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const QY_HOS_NO_REQUEST = "QY_HOS_NO_REQUEST";
export const QY_HOS_NO_SUCCESS = "QY_HOS_NO_SUCCESS";
export const QY_HOS_NO_FAIL = "QY_HOS_NO_FAIL";
export const QY_HOS_NO_RESET = "QY_HOS_NO_RESET";
export const getHospitalNumber = () => async (dispatch, getState) => { 
  try {
    dispatch({ type: QY_HOS_NO_REQUEST });

    const {
      auth: { user }
    } = getState();
    
    const branchCode = user.branchCode;

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: user.staffNo, // Add staffNo as a custom header
         // Add sessionToken as a Bearer token
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