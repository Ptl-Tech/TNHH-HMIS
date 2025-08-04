import apiHeaderConfig from "../../configHelpers";
import axios from "axios";

const API = "https://chiromo.potestastechnologies.net:8085/";

export const GET_PATIENT_VISIT_BY_NO_REQUEST = "GET_PATIENT_VISIT_BY_NO_REQUEST";
export const GET_PATIENT_VISIT_BY_NO_SUCCESS = "GET_PATIENT_VISIT_BY_NO_SUCCESS";
export const GET_PATIENT_VISIT_BY_NO_FAIL = "GET_PATIENT_VISIT_BY_NO_FAIL";
export const GET_PATIENT_VISIT_BY_NO_RESET = "GET_PATIENT_VISIT_BY_NO_RESET";

// Local cache to track in-progress requests
const requestCache = new Set();

export const getPatientVisitByNo = (visitNo) => async (dispatch, getState) => {
  if (!visitNo) return;

  const { getVisitById } = getState();
  if (getVisitById?.data?.AppointmentNo === visitNo) {
    return;
  }

  if (requestCache.has(visitNo)) {
    return;
  }

  requestCache.add(visitNo);
  dispatch({ type: GET_PATIENT_VISIT_BY_NO_REQUEST });

  try {
    const config = apiHeaderConfig(getState);
    const branchCode = localStorage.getItem("branchCode");
    
    const { data } = await axios.get(
      `${API}data/odatafilter?webservice=QyAppointmentHeader&isList=false&query=$filter=AppointmentNo eq '${visitNo}'`,
      config
    );


    if (data && Object.keys(data).length > 0) {
      const dataArray = Array.isArray(data) ? data : [data] || []; // Ensure it's an array
      const filteredData = dataArray.filter((item) => item?.Branch === branchCode);

      if (dataArray.length > 0) {
        dispatch({
          type: GET_PATIENT_VISIT_BY_NO_SUCCESS,
          payload: dataArray[0],
        });
      } else {
        dispatch({ type: GET_PATIENT_VISIT_BY_NO_FAIL, payload: "No records found" });
      }
    }
  } catch (error) {
    dispatch({
      type: GET_PATIENT_VISIT_BY_NO_FAIL,
      payload: error.response?.data?.errors || "An error occurred",
    });
  } finally {
    requestCache.delete(visitNo); // Remove from cache after completion
  }
};
