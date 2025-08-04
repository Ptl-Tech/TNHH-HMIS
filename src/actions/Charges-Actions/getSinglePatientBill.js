import axios from "axios";

const API = "https://chiromo.potestastechnologies.net:8091/";

export const GET_SINGLE_PATIENT_BILL_REQUEST =
  "GET_SINGLE_PATIENT_BILL_REQUEST";
export const GET_SINGLE_PATIENT_BILL_SUCCESS =
  "GET_SINGLE_PATIENT_BILL_SUCCESS";
export const GET_SINGLE_PATIENT_BILL_FAIL = "GET_SINGLE_PATIENT_BILL_FAIL";
export const GET_SINGLE_PATIENT_BILL_RESET = "GET_SINGLE_PATIENT_BILL_RESET";

// Local cache to track in-progress requests
const requestCache = new Set();

export const getSinglePatientBill =
  (ActiveVisitNo) => async (dispatch, getState) => {
    try {
      dispatch({ type: GET_SINGLE_PATIENT_BILL_REQUEST });

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

      const { data } = await axios.get(
        `${API}data/odatafilter?webservice=PgPatientsList&isList=false&query=$filter=ActiveVisitNo eq '${ActiveVisitNo}'`,
        config
      );
    //   dispatch({ type: GET_SINGLE_PATIENT_BILL_SUCCESS, payload: data });
//if it is an object ensure it is an array
      if (typeof data === "object" && !Array.isArray(data)) {
        const dataArray = [data];
        dispatch({ type: GET_SINGLE_PATIENT_BILL_SUCCESS, payload: dataArray });
      }

      // Add the request to the cache after successful response
      requestCache.add(ActiveVisitNo);
    } catch (error) {
        dispatch({
          type: GET_SINGLE_PATIENT_BILL_FAIL,
          payload: error.response?.data?.errors || "An error occurred",
        });
    } 
  
  };
