import { message } from "antd";
import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const POST_SYMPTOMS_REQUEST = "POST_SYMPTOMS_REQUEST";
export const POST_SYMPTOMS_SUCCESS = "POST_SYMPTOMS_SUCCESS";
export const POST_SYMPTOMS_FAIL = "POST_SYMPTOMS_FAIL";

export const postSymptomsRequest = (symptoms) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_SYMPTOMS_REQUEST });

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

    const response = await axios.post(
      `${API}Doctor/PatientSymptoms`,
      symptoms,
      config
    );

    // Extract response details
    const responseData = {
      status: response.data.status,
      data: response.data, // Assuming response.data contains the required information
    };

    setTimeout(() => {
      dispatch({ type: POST_SYMPTOMS_SUCCESS, payload: responseData });
      message.success("Symptoms posted Successfully", 2);
    }, 2000);

    // Return response data for further use
    return responseData.data; 
  } catch (error) {
   setTimeout(() => {
    dispatch({
      type: POST_SYMPTOMS_FAIL,
      payload: error.response?.data?.message || error.errors,
    });
    message.error(error.response?.data?.errors || error.errors);
    },2000);
    throw error; // Rethrow error for further handling
  }
};
