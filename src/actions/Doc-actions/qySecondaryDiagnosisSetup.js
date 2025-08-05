import axios from "axios";
const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const QY_SECONDARY_DIAGNOSIS_SETUP = "QY_SECONDARY_DIAGNOSIS_SETUP";
export const QY_SECONDARY_DIAGNOSIS_SETUP_SUCCESS = "QY_SECONDARY_DIAGNOSIS_SETUP_SUCCESS";
export const QY_SECONDARY_DIAGNOSIS_SETUP_FAIL = "QY_SECONDARY_DIAGNOSIS_SETUP_FAIL";
export const QY_SECONDARY_DIAGNOSIS_SETUP_RESET = "QY_SECONDARY_DIAGNOSIS_SETUP_RESET";


export const getSecondaryDiagnosisSetup = () => async (dispatch, getState) => {
  try {
    dispatch({ type: QY_SECONDARY_DIAGNOSIS_SETUP });

    const {
      auth: { user }
    } = getState();

    
    const branchCode = user.branchCode;
    if (!branchCode) throw new Error("Branch code not found in local storage.");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: user.staffNo, // Add staffNo as a custom header
         // Add sessionToken as a Bearer token
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
