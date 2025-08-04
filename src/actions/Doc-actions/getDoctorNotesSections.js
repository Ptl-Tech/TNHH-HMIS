import axios from "axios";

const API = "https://chiromo.potestastechnologies.net:8091/";

export const GET_DOCTOR_NOTES_SECTIONS_FAIL = "GET_DOCTOR_NOTES_SECTIONS_FAIL";
export const GET_DOCTOR_NOTES_SECTIONS_RESET =
  "GET_DOCTOR_NOTES_SECTIONS_RESET";
export const GET_DOCTOR_NOTES_SECTIONS_REQUEST =
  "GET_DOCTOR_NOTES_SECTIONS_REQUEST";
export const GET_DOCTOR_NOTES_SECTIONS_SUCCESS =
  "GET_DOCTOR_NOTES_SECTIONS_SUCCESS";

export const getDoctorsNotesSections =
  ({ treatmentNo: encounterNo }) =>
  async (dispatch, getState) => {
    console.log({ encounterNo });

    try {
      dispatch({ type: GET_DOCTOR_NOTES_SECTIONS_REQUEST });

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
          branchCode: branchCode,
        },
      };

      const response = await axios.get(
        `${API}data/odatafilter?webservice=PgFormSectionSetup`,
        config
      );

      dispatch({
        type: GET_DOCTOR_NOTES_SECTIONS_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: GET_DOCTOR_NOTES_SECTIONS_FAIL,
        payload: error.message,
      });
    }
  };
