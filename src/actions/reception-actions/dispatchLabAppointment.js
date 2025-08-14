import axios from 'axios';

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

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
      auth: { user }
    } = getState();

    const branchCode = user.branchCode

    // Use patientNo if explicitly passed, otherwise extract from record
    const resolvedPatientNo = patientNo || record.PatientNo;

    if (!resolvedPatientNo) {
      throw new Error("Patient number is required.");
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        staffNo: user.staffNo,
        
        branchCode,
      },
    };

    const payload={
      patientNo: String(resolvedPatientNo),
      staffNo: user.staffNo,
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
