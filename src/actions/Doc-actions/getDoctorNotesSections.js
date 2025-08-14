import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

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
        auth: { user }
      } = getState();
      
      const branchCode = user.branchCode;

      const config = {
        headers: {
          "Content-Type": "application/json",
          staffNo: user.staffNo, // Add staffNo as a custom header
           // Add sessionToken as a Bearer token
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
