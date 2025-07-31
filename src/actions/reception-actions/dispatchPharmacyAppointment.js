import axios from 'axios';

const API = 'https://chiromo.potestastechnologies.net:8091/';

export const POST_PHARMACY_APPOINTMENT_REQUEST =
  'POST_PHARMACY_APPOINTMENT_REQUEST';
export const POST_PHARMACY_APPOINTMENT_SUCCESS =
  'POST_PHARMACY_APPOINTMENT_SUCCESS';
export const POST_PHARMACY_APPOINTMENT_FAIL = 'POST_PHARMACY_APPOINTMENT_FAIL';
export const POST_PHARMACY_APPOINTMENT_RESET =
  'POST_PHARMACY_APPOINTMENT_RESET';

export const postPharmacyAppointment = (record = {}, patientNo = null) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_PHARMACY_APPOINTMENT_REQUEST });

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

    console.log({ config });

    const response = await axios.post(
      `${API}Reception/DirectDispatchPharmacy`,
      { PatientNo:String(resolvedPatientNo) },
      config
    );

    dispatch({
      type: POST_PHARMACY_APPOINTMENT_SUCCESS,
      payload: response.data,
    });
    return{
      type: POST_PHARMACY_APPOINTMENT_SUCCESS,
      payload: response.data,
    };
  } catch (error) {
    console.log({ error });

    dispatch({
      type: POST_PHARMACY_APPOINTMENT_FAIL,
      payload:
        error.response?.data?.errors || 'An error occurred while saving.',
    });

    return {
      type: POST_PHARMACY_APPOINTMENT_FAIL,
      payload:
        error.response?.data?.errors || 'An error occurred while saving.',
    };
  }
};
