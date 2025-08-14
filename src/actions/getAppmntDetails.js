import { message } from "antd";
import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;



export const VIEW_PATIENT_APPMNT_DATA = "VIEW_PATIENT_APPMNT_DATA";
export const VIEW_PATIENT_APPMNT_DATA_SUCCESS = "VIEW_PATIENT_APPMNT_DATA_SUCCESS";
export const VIEW_PATIENT_APPMNT_DATA_FAIL = "VIEW_PATIENT_APPMNT_DATA_FAIL";
export const VIEW_PATIENT_APPMNT_DATA_RESET = "VIEW_PATIENT_APPMNT_DATA_RESET";
export const getAppmntDetails = (appointmentId) => async (dispatch, getState) => {
  try {
    dispatch({ type: VIEW_PATIENT_APPMNT_DATA });

    const {
      auth: { user }
    } = getState();
    const branchCode = user.branchCode;

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: user.staffNo, 
        
        branchCode: branchCode,
      },
    };

    const response = await axios.get(
        `${API}data/odatafilter?webservice=QyAppointmentHeader&isList=false&query=$filter=AppointmentNo eq '${appointmentId}'`,
        config
      );
    dispatch({ type: VIEW_PATIENT_APPMNT_DATA_SUCCESS, payload: response.data });

    return response.data;

  } catch (error) {
    setTimeout(() => {
      dispatch({
        type: VIEW_PATIENT_APPMNT_DATA_FAIL,
        payload: error.response?.data?.message || error.errors,
      });
      message.error(error.response?.data?.errors || error.errors);
    }, 1200);
    throw error;
  }
};


