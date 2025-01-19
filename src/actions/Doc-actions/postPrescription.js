import { message, Modal } from "antd";
import axios from "axios";

const API = "http://217.21.122.62:8085/";

// Action Types
export const POST_PRESCRIPTION_REQUEST = "POST_PRESCRIPTION_REQUEST";
export const POST_PRESCRIPTION_SUCCESS = "POST_PRESCRIPTION_SUCCESS";
export const POST_PRESCRIPTION_FAIL = "POST_PRESCRIPTION_FAIL";

export const POST_PRESCRIPTION_TO_PHARMACY_REQUEST = "POST_PRESCRIPTION_TO_PHARMACY_REQUEST";
export const POST_PRESCRIPTION_TO_PHARMACY_SUCCESS = "POST_PRESCRIPTION_TO_PHARMACY_SUCCESS";
export const POST_PRESCRIPTION_TO_PHARMACY_FAIL = "POST_PRESCRIPTION_TO_PHARMACY_FAIL";

// Post Prescription Action
export const postPrescriptionDetails = (prescription) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_PRESCRIPTION_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no,
        sessionToken: userInfo.userData.portalSessionToken,
        branchCode: branchCode,
      },
    };

    // Send request to the backend API
    const response = await axios.post(
      `${API}Doctor/PatientPrescriptions`,
      prescription,
      config
    );

    const responseData = {
      status: response.data.status,
      data: response.data,
    };

   
    // Show success modal if status is "success"
   setTimeout(() => {
     // Dispatch success action
     dispatch({ type: POST_PRESCRIPTION_SUCCESS, payload: responseData });

    if (responseData.status === "success") {
      Modal.success({
        title: "Success",
        content: "Prescription added successfully.",
        onOk() {
          // Optional: Close the modal automatically or execute any other logic
        },
      });
    }
   }, 2000);

    return responseData.data; // Return response data if needed
  } catch (error) {
    setTimeout(() => {
      dispatch({
        type: POST_PRESCRIPTION_FAIL,
        payload: error.response?.data?.message || error.errors,
      });
      message.error(error.response?.data?.errors || error.errors);
    }, 1200);

    throw error; // Rethrow error for handling in the component
  }
};


export const sendtoPharmacy = (treatmentId) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_PRESCRIPTION_TO_PHARMACY_REQUEST });
  
      const {
        otpVerify: { userInfo },
      } = getState();
      const branchCode = localStorage.getItem("branchCode");
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          staffNo: userInfo.userData.no, // Add staffNo as a custom header
          sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
          branchCode: branchCode,
        },
      };
  
  
      // Corrected request body structure
      const response = await axios.post(
        `${API}Doctor/PrescribeDrugs`,
        {
          treatmentNo: treatmentId, // Send treatmentNo as part of the request body
        },
        config
      );
  
      // Extract response details
      const responseData = {
        status: response.data.status,
        data: response.data, // Assuming `msg` contains the patient ID
      };
  
      setTimeout(() => {
        dispatch({ type: POST_PRESCRIPTION_TO_PHARMACY_SUCCESS, payload: responseData });
        message.success("Prescription posted to pharmacy Successfully", 2);
      }, 2000);
  
      // Return patient ID for further use
      return responseData.data; // `msg` contains the patient ID
    } catch (error) {
      setTimeout(() => {
        dispatch({
          type: POST_PRESCRIPTION_TO_PHARMACY_FAIL,
          payload: error.response?.data?.message || error.errors,
        });
        message.error(error.response?.data?.errors || error.errors);
      }, 1200);
      throw error; // Rethrow error for `handleSubmit` to handle
    }
  };
  
