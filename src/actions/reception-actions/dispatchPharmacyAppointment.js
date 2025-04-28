import axios from 'axios';

const API = 'https://chiromo.potestastechnologies.net:8085/';

export const POST_PHARMACY_APPOINTMENT_REQUEST =
  'POST_PHARMACY_APPOINTMENT_REQUEST';
export const POST_PHARMACY_APPOINTMENT_SUCCESS =
  'POST_PHARMACY_APPOINTMENT_SUCCESS';
export const POST_PHARMACY_APPOINTMENT_FAIL = 'POST_PHARMACY_APPOINTMENT_FAIL';
export const POST_PHARMACY_APPOINTMENT_RESET =
  'POST_PHARMACY_APPOINTMENT_RESET';

export const postPharmacyAppointment =
  (record) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_PHARMACY_APPOINTMENT_REQUEST });

      const {
        otpVerify: { userInfo },
      } = getState();

      const { PatientNo } = record;

      const branchCode = localStorage.getItem('branchCode') || '';

      const config = {
        headers: {
          'Content-Type': 'application/json',
          staffNo: userInfo.userData.no, // Staff number
          sessionToken: userInfo.userData.portalSessionToken, // Session token
          branchCode,
        },
      };

      console.log({ config });

      const response = await axios.post(
        `${API}Reception/DirectDispatchPharmacy`,
        { PatientNo },
        config,
      );

      dispatch({
        type: POST_PHARMACY_APPOINTMENT_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      console.log({ error });

      dispatch({
        type: POST_PHARMACY_APPOINTMENT_FAIL,
        payload:
          error.response?.data?.errors || 'An error occurred while saving.',
      });

      throw new Error(
        error.response?.data?.errors || 'An error occurred while saving.',
      );
    }
  };
