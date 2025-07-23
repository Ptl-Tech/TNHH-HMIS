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
  SUB_COUNTY_WARDS_LIST_REQUEST,
  SUB_COUNTY_WARDS_LIST_SUCCESS,
  SUB_COUNTY_WARDS_LIST_FAIL,
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
  EMPLYEES_LIST_FAIL,
  MARKETING_LIST_REQUEST,
  MARKETING_LIST_SUCCESS,
  MARKETING_LIST_FAIL,
  EMPLOYEE_DETAILS_REQUEST,
  EMPLOYEE_DETAILS_SUCCESS,
  EMPLOYEE_DETAILS__FAIL,
  LOCATION_LIST_REQUEST,
  LOCATION_LIST_SUCCESS,
  LOCATION_LIST_FAIL,


} from "../constants/DropDownConstants";
import apiHeaderConfig from "./configHelpers";

const API = "https://chiromo.potestastechnologies.net:8085/";

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

  } catch (error) {
    dispatch({ type: SUB_COUNTIES_LIST_FAIL, payload: error.message });
  }
};

export const listSubCountyWards = () => async (dispatch, getState) => {
  const config = apiHeaderConfig(getState);

  try {
    dispatch({ type: SUB_COUNTY_WARDS_LIST_REQUEST });

    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=QyCountyWards`,
      config
    );

    dispatch({ type: SUB_COUNTY_WARDS_LIST_SUCCESS, payload: data });

  } catch (error) {
    dispatch({ type: SUB_COUNTY_WARDS_LIST_FAIL, payload: error.message });
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

  } catch (error) {
    dispatch({ type: INSURANCE_LIST_FAIL, payload: error.message });
  }
};

export const marketingStrategies = () => async (dispatch, getState) => {
  try {
    dispatch({ type: MARKETING_LIST_REQUEST});

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
      `${API}data/odatafilter?webservice=QyMarketingStrategies&isList=true`,
      config
    );

    dispatch({ type: MARKETING_LIST_SUCCESS, payload: data });

  } catch (error) {
    dispatch({ type: MARKETING_LIST_FAIL, payload: error.message });
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

  } catch (error) {
    dispatch({ type: EMPLYEES_LIST_FAIL, payload: error.message });
  }
};

export const getEmployeeByNumber = (staffNumber) => async (dispatch, getState) => {
  try {
    dispatch({ type: EMPLOYEE_DETAILS_REQUEST });

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

    // Correct URL construction, ensuring the staff number is correctly quoted in the query
    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=QyEmployees&isList=false&query=$filter=No eq '${staffNumber}'`,
      config
    );

    // Dispatch success action with the fetched employee data
    dispatch({ type: EMPLOYEE_DETAILS_SUCCESS, payload: data });

  } catch (error) {
    dispatch({ type: EMPLOYEE_DETAILS__FAIL, payload: error.message });
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
      `${API}reception/PatientRegistration`,
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


export const getLoactions = () => async (dispatch, getState) => {
  try {
    dispatch({ type: LOCATION_LIST_REQUEST });

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
      `${API}data/odatafilter?webservice=QyLocations&isList=true`,
      config
    );

    // // Filter data to only include doctors
    // const doctors = data.filter(
    //   (item) => item.Shortcut_Dimension_2_Code === "DOCTOR"
    // );

    dispatch({ type: LOCATION_LIST_SUCCESS, payload: data });

  } catch (error) {
    dispatch({ type: LOCATION_LIST_FAIL, payload: error.message });
  }
};



