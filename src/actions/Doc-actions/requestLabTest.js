import { message } from 'antd';
import axios from 'axios';

const API = 'https://chiromo.potestastechnologies.net:8085/';

export const REQUEST_LAB_TEST = 'REQUEST_LAB_TEST';
export const REQUEST_LAB_TEST_SUCCESS = 'REQUEST_LAB_TEST_SUCCESS';
export const REQUEST_LAB_TEST_FAIL = 'REQUEST_LAB_TEST_FAIL';

export const VIEW_PATIENT_LAB_TEST = 'VIEW_PATIENT_LAB_TEST';
export const VIEW_PATIENT_LAB_TEST_SUCCESS = 'VIEW_PATIENT_LAB_TEST_SUCCESS';
export const VIEW_PATIENT_LAB_TEST_FAIL = 'VIEW_PATIENT_LAB_TEST_FAIL';

export const requestLabTest = (treatmentId) => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_LAB_TEST });

    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem('branchCode');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        staffNo: userInfo.userData.no,
        sessionToken: userInfo.userData.portalSessionToken,
        branchCode: branchCode,
      },
    };

    const response = await axios.post(
      `${API}Doctor/RequestPatientLaboratoryTests`,
      {
        staffNo: userInfo.userData.no,
        treatmentNo: treatmentId,
      },
      config,
    );

    setTimeout(() => {
      dispatch({ type: REQUEST_LAB_TEST_SUCCESS, payload: response.data });
      // message.success("Radiology Test posted Successfully", 2);
    }, 2000);

    return response.data;
  } catch (error) {
    setTimeout(() => {
      dispatch({
        type: REQUEST_LAB_TEST_FAIL,
        payload: error.response?.data?.message || error.errors,
      });
      message.error(error.response?.data?.errors || error.errors);
    }, 1200);
    throw error;
  }
};

export const getPatientLabTest = () => async (dispatch, getState) => {
  try {
    dispatch({ type: VIEW_PATIENT_LAB_TEST });

    const {
      otpVerify: { userInfo },
    } = getState();

    const branchCode = localStorage.getItem('branchCode');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        staffNo: userInfo.userData.no,
        sessionToken: userInfo.userData.portalSessionToken,
        branchCode: branchCode,
      },
    };

    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=QyTreatmentLaboratoryLines&isList=true`,
      config,
    );

    dispatch({ type: VIEW_PATIENT_LAB_TEST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: VIEW_PATIENT_LAB_TEST_FAIL, payload: error.message });
  }
};
