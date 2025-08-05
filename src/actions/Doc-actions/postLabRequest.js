
import { message } from "antd";
import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;


export const POST_LAB_REQUEST = "POST_LAB_REQUEST";
export const POST_LAB_SUCCESS = "POST_LAB_SUCCESS";
export const POST_LAB_FAIL = "POST_LAB_FAIL";
export const postLabRequest = (labRequest) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_LAB_REQUEST });

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
      `${API}Doctor/PatientLaboratory`,
      labRequest,
      config
    );

    // Extract response details
    const responseData = {
      status: response.data.status,
      data: response.data, // Assuming `msg` contains the patient ID
    };

    dispatch({ type: POST_LAB_SUCCESS, payload: responseData });

    // Return patient ID for further use
    return responseData.data; // `msg` contains the patient ID
  } catch (error) {
    setTimeout(() => {
      dispatch({
        type: POST_LAB_FAIL,
        payload: error.response?.data?.message || error.errors,
      });
      message.error(error.response?.data?.errors || error.errors);
    }
      , 1200);
    throw error; // Rethrow error for `handleSubmit` to handle
  }
};
