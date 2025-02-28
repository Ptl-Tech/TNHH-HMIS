import axios from 'axios';
import {
  ADMIT_VISITOR_FAIL,
  ADMIT_VISITOR_REQUEST,
  ADMIT_VISITOR_SUCCESS,
  REGISTER_VISITOR_FAIL,
  REGISTER_VISITOR_REQUEST,
  REGISTER_VISITOR_SUCCESS,
  VISITORS_LIST_FAIL,
  VISITORS_LIST_REQUEST,
  VISITORS_LIST_SUCCESS,
} from '../constants/visitorsConstants';
import { message } from 'antd';

const API = 'https://chiromo.potestastechnologies.net:8085/';
export const createVisitor = (visitor) => async (dispatch, getState) => {
  try {
    dispatch({ type: REGISTER_VISITOR_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem('branchCode');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    console.log('visitor: ', visitor);

    const response = await axios.post(
      `${API}Security/GateCreateVisitor`,
      visitor,
      config,
    );

    //   // Extract response details
    const responseData = {
      status: response.data.status,
      visitorNo: response.data.visitorNo, // Assuming `msg` contains the patient ID
    };

    setTimeout(() => {
      dispatch({ type: REGISTER_VISITOR_SUCCESS, payload: data });

      console.log('Dispatched Payload:', responseData);
    }, 2000);

    // Return patient ID for further use
    return responseData.visitorNo; // `msg` contains the patient ID
  } catch (error) {
    dispatch({
      type: REGISTER_VISITOR_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    //  message.error(error.message, 5);
    throw error; // Rethrow error for `handleSubmit` to handle
  }
};

export const admitVisitor = (visitorId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADMIT_VISITOR_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();
    const branchCode = localStorage.getItem('branchCode');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    console.log('patient: ', visitorId);

    const { response } = await axios.post(
      `${API}Security/GateAdmitVisitor `,
      { visitorNo: visitorId },
      config,
    );

    //  // Extract response details
    //   const responseData = {
    //     status: response.data.status,
    //     msg: response.data.observationNo, // Assuming `msg` contains the patient ID
    //   };

    //   setTimeout(() => {
    //     console.log("Dispatched Payload:", responseData);
    //   }, 2000);

    dispatch({ type: ADMIT_VISITOR_SUCCESS, payload: response.data });
    //message with success message and observationNo
    // message.success(`Dispatched with Obs No: ${responseData.observationNo}`, 5);
  } catch (error) {
    dispatch({
      type: ADMIT_VISITOR_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    //  message.error(error.message, 5);
    throw error; // Rethrow error for `handleSubmit` to handle
  }
};

export const getVisitorsList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: VISITORS_LIST_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();
    // Fetch branchCode from localStorage
    const branchCode = localStorage.getItem('branchCode');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=QyVisitors`,
      config,
    );
    // const filteredData = data.filter((patient) => patient.GlobalDimension1Code === branchCode );

    dispatch({ type: VISITORS_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: VISITORS_LIST_FAIL, payload: error.message });
  }
};
