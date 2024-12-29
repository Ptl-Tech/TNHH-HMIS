import axios from "axios";
import { message } from "antd"; // Import Ant Design message for error handling

const API = "http://217.21.122.62:8085/";



export const REQUEST_RADIOLOGY_TEST = "REQUEST_RADIOLOGY_TEST";
export const REQUEST_RADIOLOGY_TEST_SUCCESS = "REQUEST_RADIOLOGY_TEST_SUCCESS";
export const REQUEST_RADIOLOGY_TEST_FAIL = "REQUEST_RADIOLOGY_TEST_FAIL";
export const REQUEST_RADIOLOGY_TEST_RESET = "REQUEST_RADIOLOGY_TEST_RESET";


export const VIEW_PATIENT_RADIOLOGY_TEST = "VIEW_PATIENT_RADIOLOGY_TEST";
export const VIEW_PATIENT_RADIOLOGY_TEST_SUCCESS = "VIEW_PATIENT_RADIOLOGY_TEST_SUCCESS";
export const VIEW_PATIENT_RADIOLOGY_TEST_FAIL = "VIEW_PATIENT_RADIOLOGY_TEST_FAIL";
export const VIEW_PATIENT_RADIOLOGY_TEST_RESET = "VIEW_PATIENT_RADIOLOGY_TEST_RESET";


export const requestRadiologyTest = (treatmentId) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_RADIOLOGY_TEST });

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

    // Corrected API endpoint without extra space
    const response = await axios.post(
      `${API}Doctor/RequestPatientRadiologyTests`, // Fixed URL
      {
        treatmentNo: treatmentId, // Send treatmentNo as part of the request body
      },
      config
    );

    // Extract response details
    const responseData = {
      status: response.data.status,
      data: response.data, // Assuming response contains required patient data
    };
setTimeout(() => {
      dispatch({ type: REQUEST_RADIOLOGY_TEST_SUCCESS, payload: responseData });
      message.success("Radiology Test posted Successfully", 2);
    }, 2000);

    // Return patient data for further use if necessary
    return responseData.data;
  } catch (error) {
    setTimeout(() => {
      dispatch({
        type: REQUEST_RADIOLOGY_TEST_FAIL,
        payload: error.response?.data?.message | error.errors,
      });
      message.error(error.response?.data?.errors || error.errors);
    }, 1200);
   
    throw error; // Rethrow error for further handling by the calling function
  }
};


export const getPatientRadiologyTest = (treatmentId) => async (dispatch, getState) => {
  try {
    dispatch({ type: VIEW_PATIENT_RADIOLOGY_TEST });

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

    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=QyTreatmentRadiologyLines&isList=false&query=$filter=TreatmentNo eq '${treatmentId}`,
      config
    );

    dispatch({ type: VIEW_PATIENT_RADIOLOGY_TEST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: VIEW_PATIENT_RADIOLOGY_TEST_FAIL, payload: error.message });
  }

}
