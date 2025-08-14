import axios from "axios";
import {
  ADMIT_VISITOR_FAIL,
  ADMIT_VISITOR_REQUEST,
  ADMIT_VISITOR_SUCCESS,
  REGISTER_VISITOR_FAIL,
  REGISTER_VISITOR_REQUEST,
  REGISTER_VISITOR_SUCCESS,
  VISITOR_BY_ID_FAIL,
  VISITOR_BY_ID_REQUEST,
  VISITOR_BY_ID_SUCCESS,
  VISITOR_CLEARANCE_FAIL,
  VISITOR_CLEARANCE_REQUEST,
  VISITOR_CLEARANCE_SUCCESS,
  VISITORS_LIST_FAIL,
  VISITORS_LIST_REQUEST,
  VISITORS_LIST_SUCCESS,
} from "../constants/visitorsConstants";
import { message } from "antd";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;
export const createVisitor = (visitor) => async (dispatch, getState) => {
  try {
    dispatch({ type: REGISTER_VISITOR_REQUEST });

    const {
      auth: { user },
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
      `${API}Security/GateCreateVisitor`,
      visitor,
      config
    );

    // Extract response details
    const responseData = {
      status: response.data.status,
      visitorNo: response.data.visitorNo, // Assuming `msg` contains the visitor number
    };

    dispatch({ type: REGISTER_VISITOR_SUCCESS, payload: responseData });

    // Return visitorNo for further use
    return responseData.visitorNo;
  } catch (error) {
    dispatch({
      type: REGISTER_VISITOR_FAIL,
      payload: error.response?.data?.message || error.message,
    });

    throw error; // Rethrow error for `handleSubmit` to handle
  }
};

export const admitVisitor = (visitorId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADMIT_VISITOR_REQUEST });

    const {
      auth: { user },
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
      `${API}Security/GateAdmitVisitor `,
      { visitorNo: visitorId },
      config
    );

    // Extract response details
    const responseData = {
      status: response.data.status,
      visitorNo: response.data.visitorNo, // Assuming `msg` contains the patient ID
    };

    console.log("API Response:", response); // Debugging
    dispatch({ type: ADMIT_VISITOR_SUCCESS, payload: responseData });

    return responseData.visitorNo; // `msg` contains the patient ID
  } catch (error) {
    dispatch({
      type: ADMIT_VISITOR_FAIL,
      payload: error.response?.data?.errors || error.message,
    });
    console.log("API Error:", error.response?.data?.errors); // Debugging
    //  message.error(error.message, 5);
    throw error;
  }
};

export const getVisitorsList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: VISITORS_LIST_REQUEST });

    const {
      auth: { user },
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

    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=QyVisitors`,
      config
    );

    const filteredData = data.filter(
      (visitor) => visitor.GlobalDimension1Code === branchCode
    );

    dispatch({ type: VISITORS_LIST_SUCCESS, payload: filteredData });
  } catch (error) {
    dispatch({ type: VISITORS_LIST_FAIL, payload: error.message });
  }
};

export const getVisitorById = (idNumber) => async (dispatch, getState) => {
  try {
    dispatch({ type: VISITOR_BY_ID_REQUEST });

    const {
      auth: { user },
    } = getState();

    const branchCode = user.branchCode || "";

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: user.staffNo, // Add staffNo as a custom header
        // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=QyVisitors&isList=false&query=$filter=IDNumber eq '${idNumber}'`,
      config
    );

    if (data && Object.keys(data).length > 0) {
      dispatch({ type: VISITOR_BY_ID_SUCCESS, payload: data });
      return data;
    } else {
      dispatch({
        type: VISITOR_BY_ID_FAIL,
        payload: "Registered visitor not found",
      });
      return null;
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching visitor data.";
    dispatch({ type: VISITOR_BY_ID_FAIL, payload: errorMessage });
    return null;
  }
};

export const clearVisitor = (visitorId) => async (dispatch, getState) => {
  try {
    dispatch({ type: VISITOR_CLEARANCE_REQUEST });

    const {
      auth: { user },
    } = getState();

    const staffNo = user.staffNo;
    const branchCode = user.branchCode;

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: staffNo,
        branchCode: branchCode,
      },
    };

    const response = await axios.post(
      `${API}Security/GateClearVisitor`,
      { staffNo: staffNo, visitorNo: visitorId },
      config
    );

    // Extract response details
    const responseData = {
      status: response.data.status,
      visitorNo: response.data.visitorNo,
    };

    dispatch({ type: VISITOR_CLEARANCE_SUCCESS, payload: responseData });

    return responseData.visitorNo;
  } catch (error) {
    dispatch({ type: VISITOR_CLEARANCE_FAIL, payload: error.message });
  }
};
