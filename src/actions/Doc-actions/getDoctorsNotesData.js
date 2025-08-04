import axios from "axios";

const API = "https://chiromo.potestastechnologies.net:8091/";

export const GET_DOCTOR_NOTES_FAIL = "GET_DOCTOR_NOTES_FAIL";
export const GET_DOCTOR_NOTES_RESET = "GET_DOCTOR_NOTES_RESET";
export const GET_DOCTOR_NOTES_REQUEST = "GET_DOCTOR_NOTES_REQUEST";
export const GET_DOCTOR_NOTES_SUCCESS = "GET_DOCTOR_NOTES_SUCCESS";

export const getDoctorsNotesData =
  ({ treatmentNo: encounterNo }) =>
  async (dispatch, getState) => {
    console.log({ encounterNo });

    try {
      dispatch({ type: GET_DOCTOR_NOTES_REQUEST });

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

      const [
        sectionsResponse,
        sectionCategoriesResponse,
        consultationNotesFormResponse,
      ] = await Promise.all([
        axios.get(
          `${API}data/odatafilter?webservice=PgFormSectionSetup`,
          config
        ),
        axios.get(
          `${API}data/odatafilter?webservice=PgFormSectionCategories`,
          config
        ),
        axios.get(
          `${API}data/odatafilter?webservice=QyFormItems`,
          config
        ),
      ]);

      console.log({
        consultationNotesFormResponse: consultationNotesFormResponse.data,
      });

      const result = {
        sections: sectionsResponse?.data,
        sectionCategories: sectionCategoriesResponse?.data,
        formItems: consultationNotesFormResponse.data,
      };

      dispatch({ type: GET_DOCTOR_NOTES_SUCCESS, payload: result });
    } catch (error) {
      dispatch({ type: GET_DOCTOR_NOTES_FAIL, payload: error.message });
    }
  };
