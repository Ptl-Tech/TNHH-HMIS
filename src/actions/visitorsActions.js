import axios from 'axios';
import {
  ADMIT_VISITOR_FAIL,
  ADMIT_VISITOR_REQUEST,
  ADMIT_VISITOR_SUCCESS,
  REGISTER_VISITOR_FAIL,
  REGISTER_VISITOR_REQUEST,
  REGISTER_VISITOR_SUCCESS,
  VISITOR_CLEARANCE_FAIL,
  VISITOR_CLEARANCE_REQUEST,
  VISITOR_CLEARANCE_SUCCESS,
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
    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
        branchCode: branchCode,
      },
    };

    console.log("visitor: ", visitor);

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
      dispatch({ type:ADMIT_VISITOR_REQUEST  });
  
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
      dispatch({ type: ADMIT_VISITOR_SUCCESS, payload: responseData});
    
     return responseData.visitorNo; // `msg` contains the patient ID
  
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
   const branchCode = localStorage.getItem("branchCode");
  
      const config = {
          headers: {
              "Content-Type": "application/json",
              staffNo: userInfo.userData.no, // Add staffNo as a custom header
              sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
              branchCode: branchCode
            },
      };
  
      const {data} = await axios.get(`${API}data/odatafilter?webservice=QyVisitors`, config);

const filteredData=data.filter(
  (visitor)=>visitor.GlobalDimension1Code===branchCode
);

dispatch({ type: VISITORS_LIST_SUCCESS, payload: filteredData });

    } catch (error) {
      dispatch({ type: VISITORS_LIST_FAIL, payload: error.message });
    }
  };


  export const clearVisitor = (visitorId) => async (dispatch, getState) => {
    try {
      dispatch({ type: VISITOR_CLEARANCE_REQUEST });
  
      const {
        otpVerify: { userInfo },
      } = getState();
  
      const branchCode = localStorage.getItem("branchCode");
      const staffNo = userInfo.userData.no; 
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          staffNo: staffNo, 
          sessionToken: userInfo.userData.portalSessionToken,
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
  