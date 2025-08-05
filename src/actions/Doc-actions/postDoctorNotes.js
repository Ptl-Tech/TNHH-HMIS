import { message } from "antd";
import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const POST_DOCTOR_NOTES_REQUEST = "POST_DOCTOR_NOTES_REQUEST";
export const POST_DOCTOR_NOTES_SUCCESS = "POST_DOCTOR_NOTES_SUCCESS";
export const POST_DOCTOR_NOTES_FAIL = "POST_DOCTOR_NOTES_FAIL";
export const POST_DOCTOR_NOTES_RESET = "POST_DOCTOR_NOTES_RESET";

export const postDoctorNotes = (doctorNotes) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_DOCTOR_NOTES_REQUEST });

   
    const {
      auth: { user }
    } = getState();
    const branchCode = user.branchCode;

    // Set headers for the request
    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: user.staffNo, // Custom header for staff number
         // Bearer token for session
        branchCode: branchCode, 
      },
    };

    // Log doctorNotes to verify the structure
    console.log("Doctor Notes Request:", doctorNotes);

    // Make the POST request to the server
    const response = await axios.post(
      `${API}Doctor/DoctorTreatmentNotes`,
      doctorNotes, // Send the doctor notes in the request body
      config
    );

    // Extract response data
    const responseData = {
      status: response.data.status,
      data: response.data, // Assuming `msg` contains the patient ID or relevant data
    };

    // Dispatch success action with response data
    dispatch({ type: POST_DOCTOR_NOTES_SUCCESS, payload: responseData });
    message.success("Doctor Notes saved successfully!", 2);

    // Return patient ID or other relevant data
    return responseData.data; 
  } catch (error) {
    // Handle error in case the request fails
    dispatch({
      type: POST_DOCTOR_NOTES_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    message.error(error.response?.data?.message || "Failed to save Doctor Notes.");
    
    // Rethrow error for handling by other parts of the app
    throw error;
  }
};
