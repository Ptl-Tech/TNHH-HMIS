import axios from 'axios';

const API = 'https://chiromo.potestastechnologies.net:8091/';

export const POST_LAB_APPOINTMENT_REQUEST =
  'POST_LAB_APPOINTMENT_REQUEST';
export const POST_LAB_APPOINTMENT_SUCCESS =
  'POST_LAB_APPOINTMENT_SUCCESS';
export const POST_LAB_APPOINTMENT_FAIL = 'POST_LAB_APPOINTMENT_FAIL';
export const POST_LAB_APPOINTMENT_RESET =
  'POST_LAB_APPOINTMENT_RESET';

export const postLabAppointment = (record = {}, patientNo = null) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_LAB_APPOINTMENT_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();

    const branchCode = localStorage.getItem('branchCode') || '';

    // Use patientNo if explicitly passed, otherwise extract from record
    const resolvedPatientNo = patientNo || record.PatientNo;

    if (!resolvedPatientNo) {
      throw new Error("Patient number is required.");
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        staffNo: userInfo.userData.no,
        sessionToken: userInfo.userData.portalSessionToken,
        branchCode,
      },
    };

    const payload={
      patientNo: String(resolvedPatientNo),
      staffNo: userInfo.userData.no,
      branchCode: branchCode

    }

    const response = await axios.post(
      `${API}Laboratory/DirectLabRequest`,
      payload,
      config
    );

    dispatch({
      type: POST_LAB_APPOINTMENT_SUCCESS,
      payload: response.data,
    });
    return{
      type: POST_LAB_APPOINTMENT_SUCCESS,
      payload: response.data,
    };
  } catch (error) {
    console.log({ error });

    dispatch({
      type: POST_LAB_APPOINTMENT_FAIL,
      payload:
        error.response?.data?.errors || 'An error occurred while saving.',
    });

    return {
      type: POST_LAB_APPOINTMENT_FAIL,
      payload:
        error.response?.data?.errors || 'An error occurred while saving.',
    };
  }
};
