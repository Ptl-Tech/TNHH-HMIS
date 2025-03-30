import apiHeaderConfig from "../../configHelpers";
import axios from "axios";

const API = "https://chiromo.potestastechnologies.net:8085/";

export const CREATE_PATIENT_VISIT_REQUEST = "CREATE_PATIENT_VISIT_REQUEST";
export const CREATE_PATIENT_VISIT_SUCCESS = "CREATE_PATIENT_VISIT_SUCCESS";
export const CREATE_PATIENT_VISIT_FAIL = "CREATE_PATIENT_VISIT_FAIL";
export const CREATE_PATIENT_VISIT_RESET = "CREATE_PATIENT_VISIT_RESET"; 

export const createPatientVisitRequest = (visitData, navigate) => async (dispatch, getState) => {
  try {
    dispatch({ type: CREATE_PATIENT_VISIT_REQUEST });

    const config = apiHeaderConfig(getState);

    // If config is missing, redirect to login and stop execution
    if (!config) {
      navigate("/login"); 
      throw new Error("User information not available.");
    }

    const response = await axios.post(`${API}Reception/CreateVisit`, visitData, config);

    dispatch({ type: CREATE_PATIENT_VISIT_SUCCESS, payload: response.data });

  } catch (error) {
    dispatch({
      type: CREATE_PATIENT_VISIT_FAIL,
      payload: error.response?.data?.errors || "An error occurred",
    });

    throw error;
  }
};
