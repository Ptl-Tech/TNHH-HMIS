import axios from "axios";
import configHelper from "../../actions/configHelpers";
import { BRIEF_MSE_FORM_ID } from "../Doc-actions/saveDoctorNotes";

const API = "https://chiromo.potestastechnologies.net:8091/";

export const GET_BRIEF_MSE_DATA_FAIL = "GET_BRIEF_MSE_DATA_FAIL";
export const GET_BRIEF_MSE_DATA_RESET = "GET_BRIEF_MSE_DATA_RESET";
export const GET_BRIEF_MSE_DATA_SUCCESS = "GET_BRIEF_MSE_DATA_SUCESS";
export const GET_BRIEF_MSE_DATA_REQUEST = "GET_BRIEF_MSE_DATA_REQUEST";

export const getBriefMSENotesData =
  (encounterNo) => async (dispatch, getState) => {
    try {
      dispatch({ type: GET_BRIEF_MSE_DATA_REQUEST });

      const config = configHelper(getState);

      const [
        sectionsResponse,
        sectionCategoriesResponse,
        consultationNotesFormResponse,
      ] = await Promise.all([
        axios.get(
          `${API}data/odatafilter?webservice=PgFormSectionSetup&query=$filter=Section_ID eq '${BRIEF_MSE_FORM_ID}'`,
          config
        ),
        axios.get(
          `${API}data/odatafilter?webservice=PgFormSectionCategories&query=$filter=Section_ID eq '${BRIEF_MSE_FORM_ID}'`,
          config
        ),
        axios.get(
          `${API}data/odatafilter?webservice=PgBriefMSEForm&query=$filter=Encounter_No eq '${encounterNo}'`,
          config
        ),
      ]);

      const result = {
        sections: sectionsResponse?.data,
        formItems: consultationNotesFormResponse.data,
        sectionCategories: sectionCategoriesResponse?.data,
      };

      dispatch({ type: GET_BRIEF_MSE_DATA_SUCCESS, payload: result });
    } catch (error) {
      dispatch({ type: GET_BRIEF_MSE_DATA_FAIL, payload: error.message });
    }
  };
