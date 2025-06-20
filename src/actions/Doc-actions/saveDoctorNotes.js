import { message } from "antd";
import axios from "axios";

const API = "https://chiromo.potestastechnologies.net:8085/";

export const SAVE_DOCTOR_NOTES_RESET = "SAVE_DOCTOR_NOTES_RESET";
export const SAVE_DOCTOR_NOTES_ERROR = "SAVE_DOCTOR_NOTES_ERROR";
export const SAVE_DOCTOR_NOTES_REQUEST = "SAVE_DOCTOR_NOTES_REQUEST";
export const SAVE_DOCTOR_NOTES_SUCCESS = "SAVE_DOCTOR_NOTES_SUCCESS";

export const BRIEF_MSE_FORM_ID = "SEC008";

export const saveDoctorNotes = (data) => async (dispatch, getState) => {
  /* 
      - This action saves both the doctor's notes and the nurse's notes specifically the Brief MSE form notes
      - This is why the query can either be one of the two.
   */
  const query =
    data?.sectionId === BRIEF_MSE_FORM_ID
      ? `${API}InpatientForms/BriefMSEForm`
      : `${API}Doctor/SavePatientNotesFormItem`;

  try {
    dispatch({ type: SAVE_DOCTOR_NOTES_REQUEST });

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

    const response = await axios.post(query, { ...data }, config);

    console.log({ response });

    dispatch({ type: SAVE_DOCTOR_NOTES_SUCCESS, payload: response.data });
  } catch (error) {
    console.log({ error });

    setTimeout(() => {
      dispatch({
        type: SAVE_DOCTOR_NOTES_ERROR,
        payload: error.response?.data?.message || error.message,
      });
    }, 1200);
    throw error;
  }
};
