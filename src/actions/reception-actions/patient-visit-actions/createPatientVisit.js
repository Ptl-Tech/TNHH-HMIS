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
    let responseData;
    console.log("data", data);
    if (data?.status?.toLowerCase() === "success") {

      responseData = {
        status: data.status,
        message: data.appointmentNo,
        data: data.appointment,
      };

      dispatch({ type: CREATE_PATIENT_VISIT_SUCCESS, payload: responseData });
    }; 
  return responseData;

  } catch (error) {
    const errMsg =
      error.response?.data?.errors || 
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred while creating the patient visit. Please try again later.If the problem persists, please contact support.";

    const errorResponse = {
      status: "error",
      message: errMsg,
    };

    dispatch({ type: CREATE_PATIENT_VISIT_FAIL, payload: errorResponse });
    return errorResponse; 
  }
};

