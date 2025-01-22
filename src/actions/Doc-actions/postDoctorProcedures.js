import { message } from "antd";
import axios from "axios";

const API = "http://217.21.122.62:8085/";

// Action Types
export const POST_PATIENT_ETC_REQUEST_REQUEST = "POST_PATIENT_ETC_REQUEST_REQUEST";
export const POST_PATIENT_ETC_REQUEST_SUCCESS = "POST_PATIENT_ETC_REQUEST_SUCCESS";
export const POST_PATIENT_ETC_REQUEST_FAIL = "POST_PATIENT_ETC_REQUEST_FAIL";
export const POST_PATIENT_ETC_REQUEST_RESET = "POST_PATIENT_ETC_REQUEST_RESET";

export const POST_PATIENT_KETAMINE_REQUEST_REQUEST = "POST_PATIENT_KETAMINE_REQUEST_REQUEST";
export const POST_PATIENT_KETAMINE_REQUEST_SUCCESS = "POST_PATIENT_KETAMINE_REQUEST_SUCCESS";
export const POST_PATIENT_KETAMINE_REQUEST_FAIL = "POST_PATIENT_KETAMINE_REQUEST_FAIL";
export const POST_PATIENT_KETAMINE_REQUEST_RESET = "POST_PATIENT_KETAMINE_REQUEST_RESET";

export const GET_PATIENT_ETC_REQUEST_REQUEST = "GET_PATIENT_ETC_REQUEST_REQUEST";
export const GET_PATIENT_ETC_REQUEST_SUCCESS = "GET_PATIENT_ETC_REQUEST_SUCCESS";
export const GET_PATIENT_ETC_REQUEST_FAIL = "GET_PATIENT_ETC_REQUEST_FAIL";
export const GET_PATIENT_ETC_REQUEST_RESET = "GET_PATIENT_ETC_REQUEST_RESET";

export const POST_PATIENT_IMPLANT_REQUEST_REQUEST = "POST_PATIENT_IMPLANT_REQUEST_REQUEST";
export const POST_PATIENT_IMPLANT_REQUEST_SUCCESS = "POST_PATIENT_IMPLANT_REQUEST_SUCCESS";
export const POST_PATIENT_IMPLANT_REQUEST_FAIL = "POST_PATIENT_IMPLANT_REQUEST_FAIL";
export const POST_PATIENT_IMPLANT_REQUEST_RESET = "POST_PATIENT_IMPLANT_REQUEST_RESET";

export const GET_PATIENT_KETAMINE_REQUEST_REQUEST = "GET_PATIENT_KETAMINE_REQUEST_REQUEST";
export const GET_PATIENT_KETAMINE_REQUEST_SUCCESS = "GET_PATIENT_KETAMINE_REQUEST_SUCCESS";
export const GET_PATIENT_KETAMINE_REQUEST_FAIL = "GET_PATIENT_KETAMINE_REQUEST_FAIL";
export const GET_PATIENT_KETAMINE_REQUEST_RESET = "GET_PATIENT_KETAMINE_REQUEST_RESET";

// Post Prescription Action
export const postPatientECTRequest = (prescription) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_PATIENT_ETC_REQUEST_REQUEST });

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
      `${API}GeneralProcesses/PatientECTRequest`,
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
     dispatch({ type: POST_PATIENT_ETC_REQUEST_SUCCESS, payload: responseData });

    if (responseData.status === "success") {
      message.success("Patient ECT Requested Successfully");
    }
   }, 2000);

    return responseData.data; // Return response data if needed
  } catch (error) {
    setTimeout(() => {
      dispatch({
        type: POST_PATIENT_ETC_REQUEST_FAIL,
        payload: error.response?.data?.message || error.errors,
      });
      message.error(error.response?.data?.errors || error.errors);
    }, 1200);

    throw error; // Rethrow error for handling in the component
  }
};

export const postPatientImplantRequest = (prescription) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_PATIENT_IMPLANT_REQUEST_REQUEST });
  
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
        `${API}GeneralProcesses/PatientImplantRequest`,
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
       dispatch({ type: POST_PATIENT_IMPLANT_REQUEST_SUCCESS, payload: responseData });
  
      if (responseData.status === "success") {
        message.success("Patient ECT Requested Successfully");
      }
     }, 2000);
  
      return responseData.data; // Return response data if needed
    } catch (error) {
      setTimeout(() => {
        dispatch({
          type: POST_PATIENT_IMPLANT_REQUEST_FAIL,
          payload: error.response?.data?.message || error.errors,
        });
        message.error(error.response?.data?.errors || error.errors);
      }, 1200);
  
      throw error; // Rethrow error for handling in the component
    }
  };

export const postPatientKetamineRequest = (prescription) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_PATIENT_KETAMINE_REQUEST_REQUEST });
  
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
        `${API}GeneralProcesses/PatientKetamineRequest`,
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
       dispatch({ type: POST_PATIENT_KETAMINE_REQUEST_SUCCESS, payload: responseData });
  
      if (responseData.status === "success") {
        message.success("Patient ECT Requested Successfully");
      }
     }, 2000);
  
      return responseData.data; // Return response data if needed
    } catch (error) {
      setTimeout(() => {
        dispatch({
          type: POST_PATIENT_KETAMINE_REQUEST_FAIL,
          payload: error.response?.data?.message || error.errors,
        });
        message.error(error.response?.data?.errors || error.errors);
      }, 1200);
  
      throw error; // Rethrow error for handling in the component
    }
  };


export const getPatientECTRequest = () => async (dispatch, getState) => {
    try {
      dispatch({ type: GET_PATIENT_ETC_REQUEST_REQUEST });
  
      const {
        otpVerify: { userInfo },
      } = getState();
      const branchCode = localStorage.getItem("branchCode");
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          staffNo: userInfo?.userData?.no,
          sessionToken: userInfo?.userData?.portalSessionToken,
          branchCode: branchCode,
        },
      };
  
      const response = await axios.get(
        `${API}data/odatafilter?webservice=PgProcedureRequestList&isList=true`,
        config
      );
  
      dispatch({ type: GET_PATIENT_ETC_REQUEST_SUCCESS, payload: response.data });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch diagnosis lines";
      
      // Display error message using Ant Design's message component
      message.error(errorMessage);
  
      dispatch({ type: GET_PATIENT_ETC_REQUEST_FAIL, payload: errorMessage });
    }
  };

  export const getPatientKetamineRequest = () => async (dispatch, getState) => {
    try {
      dispatch({ type: GET_PATIENT_KETAMINE_REQUEST_REQUEST });
  
      const {
        otpVerify: { userInfo },
      } = getState();
      const branchCode = localStorage.getItem("branchCode");
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          staffNo: userInfo?.userData?.no,
          sessionToken: userInfo?.userData?.portalSessionToken,
          branchCode: branchCode,
        },
      };
  
      const response = await axios.get(
        `${API}data/odatafilter?webservice=PgProcedureRequestList&isList=true`,
        config
      );
  
      dispatch({ type: GET_PATIENT_KETAMINE_REQUEST_SUCCESS, payload: response.data });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch diagnosis lines";
      
      // Display error message using Ant Design's message component
      message.error(errorMessage);
  
      dispatch({ type: GET_PATIENT_KETAMINE_REQUEST_FAIL, payload: errorMessage });
    }
  };

