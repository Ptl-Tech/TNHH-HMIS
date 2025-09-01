import apiHeaderConfig from "../../configHelpers";
import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const CREATE_PATIENT_VISIT_REQUEST = "CREATE_PATIENT_VISIT_REQUEST";
export const CREATE_PATIENT_VISIT_SUCCESS = "CREATE_PATIENT_VISIT_SUCCESS";
export const CREATE_PATIENT_VISIT_FAIL = "CREATE_PATIENT_VISIT_FAIL";
export const CREATE_PATIENT_VISIT_RESET = "CREATE_PATIENT_VISIT_RESET"; 

export const createPatientVisitRequest = (visitData, navigate) => async (dispatch, getState) => {
  try {
    dispatch({ type: CREATE_PATIENT_VISIT_REQUEST });

    const config = apiHeaderConfig(getState);
    const { data } = await axios.post(`${API}Reception/CreateVisit`, visitData, config);
console.log("data logged", data);
    let responseData;

    if (data?.status === "success") {
      responseData = {
        status: data.status,
        message: data.message,
        data: data.data,
      };

      dispatch({ type: CREATE_PATIENT_VISIT_SUCCESS, payload: responseData });
    }; 

  } catch (error) {
    const errMsg =
      error.response?.data?.errors ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    const errorResponse = {
      status: "error",
      message: errMsg,
    };

    dispatch({ type: CREATE_PATIENT_VISIT_FAIL, payload: errorResponse });
    return errorResponse; // ✅ return structured error instead of throwing
  }
};

