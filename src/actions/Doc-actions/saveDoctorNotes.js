import { message } from "antd";
import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

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
