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
        staffNo: userInfo.userData.no,
        sessionToken: userInfo.userData.portalSessionToken,
        branchCode: branchCode,
      },
    };

    const response = await axios.post(
      `${API}Doctor/RequestPatientRadiologyTests`,
      { treatmentNo: treatmentId },
      config
    );

    const responseData = {
      status: response.data.status,
      data: response.data,
    };

    setTimeout(() => {
      dispatch({ type: REQUEST_RADIOLOGY_TEST_SUCCESS, payload: responseData });
      message.success("Radiology Test posted Successfully", 2);
    }, 2000);

    return responseData.data;
  } catch (error) {
    setTimeout(() => {
      const errorMessage = error.response?.data?.errors || error.message || "An error occurred";
      dispatch({
        type: REQUEST_RADIOLOGY_TEST_FAIL,
        payload: errorMessage,
      });
      message.error(errorMessage, 2);
    }, 1200);

    throw error;
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

    const response = await axios.get(
      `${API}data/odatafilter?webservice=QyTreatmentRadiologyLines&isList=false&query=$filter=TreatmentNo eq '${treatmentId}'`,
      config
    );

    dispatch({ type: VIEW_PATIENT_RADIOLOGY_TEST_SUCCESS, payload: response.data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch radiology test data";
    dispatch({ type: VIEW_PATIENT_RADIOLOGY_TEST_FAIL, payload: errorMessage });
  }
};
