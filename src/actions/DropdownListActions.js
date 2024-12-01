import axios from "axios";
import { message } from "antd";
import useAuth from "../hooks/useAuth";
import {
  COUNTRIES_LIST_FAIL,
  COUNTRIES_LIST_REQUEST,
  COUNTRIES_LIST_SUCCESS,
  COUNTIES_LIST_REQUEST,
  COUNTIES_LIST_SUCCESS,
  COUNTIES_LIST_FAIL,
  SUB_COUNTIES_LIST_REQUEST,
  SUB_COUNTIES_LIST_SUCCESS,
  SUB_COUNTIES_LIST_FAIL,
  CLINICS_LIST_REQUEST,
  CLINICS_LIST_SUCCESS,
  CLINICS_LIST_FAIL,
  KINS_LIST_REQUEST,
  KINS_LIST_SUCCESS,
  KINS_LIST_FAIL,
  INSURANCE_LIST_REQUEST,
  INSURANCE_LIST_SUCCESS,
  INSURANCE_LIST_FAIL,
  DOCTOR_LIST_REQUEST,
  DOCTOR_LIST_SUCCESS,
  DOCTOR_LIST_FAIL,
  EMPLOYEES_LIST_REQUEST,
  EMPLOYEES_LIST_SUCCESS,
  EMPLYEES_LIST_FAIL

} from "../constants/DropDownConstants";

const API = "http://217.21.122.62:8085/";
console.log("Base URL: ", API);

export const listCountries = () => async (dispatch, getState) => {
  try {
    dispatch({ type: COUNTRIES_LIST_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();
    // Fetch branchCode from localStorage
    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=QyCountries`,
      config
    );

    dispatch({ type: COUNTRIES_LIST_SUCCESS, payload: data });

    console.log("data: ", data);
  } catch (error) {
    dispatch({ type: COUNTRIES_LIST_FAIL, payload: error.message });
  }
};

export const listCounties = () => async (dispatch, getState) => {
  try {
    dispatch({ type: COUNTIES_LIST_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();
    // Fetch branchCode from localStorage
    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=QyCounties`,
      config
    );

    dispatch({ type: COUNTIES_LIST_SUCCESS, payload: data });

    console.log("data: ", data);
  } catch (error) {
    dispatch({ type: COUNTIES_LIST_FAIL, payload: error.message });
  }
};

export const listSubCounties = () => async (dispatch, getState) => {
  try {
    dispatch({ type: SUB_COUNTIES_LIST_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();
    // Fetch branchCode from localStorage
    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=QySubcounties`,
      config
    );

    dispatch({ type: SUB_COUNTIES_LIST_SUCCESS, payload: data });

    console.log("data: ", data);
  } catch (error) {
    dispatch({ type: SUB_COUNTIES_LIST_FAIL, payload: error.message });
  }
};

export const listClinics = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CLINICS_LIST_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();
    // Fetch branchCode from localStorage
    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=QyClinics`,
      config
    );

    dispatch({ type: CLINICS_LIST_SUCCESS, payload: data });

    console.log("data: ", data);
  } catch (error) {
    dispatch({ type: CLINICS_LIST_FAIL, payload: error.message });
  }
};
export const listKinsRelationships = () => async (dispatch, getState) => {
  try {
    dispatch({ type: KINS_LIST_REQUEST});

    const {
      otpVerify: { userInfo },
    } = getState();
    // Fetch branchCode from localStorage
    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=QyRelationships&isList=true`,
      config
    );

    dispatch({ type: KINS_LIST_SUCCESS, payload: data });

    console.log("data: ", data);
  } catch (error) {
    dispatch({ type: KINS_LIST_FAIL, payload: error.message });
  }
};


export const listInsuranceOptions = () => async (dispatch, getState) => {
  try {
    dispatch({ type: INSURANCE_LIST_REQUEST});

    const {
      otpVerify: { userInfo },
    } = getState();
    // Fetch branchCode from localStorage
    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=QyCustomers&isList=true`,
      config
    );

    dispatch({ type: INSURANCE_LIST_SUCCESS, payload: data });

    console.log("data: ", data);
  } catch (error) {
    dispatch({ type: INSURANCE_LIST_FAIL, payload: error.message });
  }
};


export const listDoctors = () => async (dispatch, getState) => {
  try {
    dispatch({ type: DOCTOR_LIST_REQUEST });

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
      `${API}data/odatafilter?webservice=QyDoctorsSetup&isList=true`,
      config
    );

    // // Filter data to only include doctors
    // const doctors = data.filter(
    //   (item) => item.Shortcut_Dimension_2_Code === "DOCTOR"
    // );

    dispatch({ type: DOCTOR_LIST_SUCCESS, payload: data });

    console.log("Filtered DOCTORS data: ", data);
  } catch (error) {
    dispatch({ type: DOCTOR_LIST_FAIL, payload: error.message });
  }
};


export const getEmployeesList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: EMPLOYEES_LIST_REQUEST });

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
      `${API}data/odatafilter?webservice=QyEmployees&isList=true`,
      config
    );

    // // Filter data to only include doctors
    // const doctors = data.filter(
    //   (item) => item.Shortcut_Dimension_2_Code === "DOCTOR"
    // );

    dispatch({ type: EMPLOYEES_LIST_SUCCESS, payload: data });

    console.log("Filtered employees data: ", data);
  } catch (error) {
    dispatch({ type: EMPLYEES_LIST_FAIL, payload: error.message });
  }
};

export const branchesList = (patient) => async (dispatch, getState) => {
  try {
    dispatch({ type: PATIENT_REGISTER_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portal_Session_Token, // Add sessionToken as a Bearer token
      },
    };

    console.log("patient: ", patient);

    const response = await aaxios.post(
      `${API}Reception/PatientRegistration`,
      patient,
      config
    );

    // Extract response details
    const responseData = {
      status: response.data.status,
      msg: response.data.msg, // Assuming `msg` contains the patient ID
    };

    setTimeout(() => {
      dispatch({ type: PATIENT_REGISTER_SUCCESS, payload: responseData });
      console.log("Dispatched Payload:", responseData);
    }, 2000);

    // Return patient ID for further use
    return responseData.msg; // `msg` contains the patient ID
  } catch (error) {
    dispatch({
      type: PATIENT_REGISTER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    message.error(error.message, 5);
    throw error; // Rethrow error for `handleSubmit` to handle
  }
};
