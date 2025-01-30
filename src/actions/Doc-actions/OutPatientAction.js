import axios from "axios";

const API = "http://217.21.122.62:8085/";

export const TREATMENT_LIST_REQUEST = "TREATMENT_LIST_REQUEST";
export const TREATMENT_LIST_SUCCESS = "TREATMENT_LIST_SUCCESS";
export const TREATMENT_LIST_FAIL = "TREATMENT_LIST_FAIL";
export const TREATMENT_LIST_RESET = "TREATMENT_LIST_RESET";

export const GET_PATIENT_DETAILS_REQUEST = "GET_PATIENT_DETAILS_REQUEST";
export const GET_PATIENT_DETAILS_SUCCESS = "GET_PATIENT_DETAILS_SUCCESS";
export const GET_PATIENT_DETAILS_FAILURE = "GET_PATIENT_DETAILS_FAILURE";
export const GET_PATIENT_DETAILS_RESET = "GET_PATIENT_DETAILS_RESET";

export const getOutPatientTreatmentList = () => async (dispatch, getState) => { 
    try {
      dispatch({ type: TREATMENT_LIST_REQUEST });
  
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
          branchCode: branchCode, // Include branchCode in headers
        },
      };
  
      const { data } = await axios.get(`${API}data/odatafilter?webservice=QyTreatmentHeaders`, config);
  
      // Filter the patients by branchCode matching GlobalDimension1Code
      const filteredData = data.filter((patient) => patient.InPatient===false);
      //patient.GlobalDimension1Code === branchCode  && 

      console.log("filteredData: ", filteredData);
  
      dispatch({ type: TREATMENT_LIST_SUCCESS, payload: filteredData });
    } catch (error) {
      dispatch({ type: TREATMENT_LIST_FAIL, payload: error.message });
    }
  };


  //export const getPatientDetails
  export const getPatientDetails = (patientNo) => async (dispatch, getState) => { 
    try {
      dispatch({ type: GET_PATIENT_DETAILS_REQUEST });
  
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
          branchCode: branchCode, // Include branchCode in headers
        },
      };
  
      const { data } = await axios.get(`${API}data/odatafilter?webservice=PgPatientsList&isList=false&query=$filter=PatientNo eq '${patientNo}'`, config);
  
      // Filter the patients by branchCode matching GlobalDimension1Code
      // const filteredData = data.filter((patient) => patient.InPatient===false);
      // //patient.GlobalDimension1Code === branchCode  && 

      
      dispatch({ type: GET_PATIENT_DETAILS_SUCCESS, payload: data });
      console.log("data fetched", data);
    } catch (error) {
      dispatch({ type: GET_PATIENT_DETAILS_FAILURE, payload: error.message });
    }
  };
