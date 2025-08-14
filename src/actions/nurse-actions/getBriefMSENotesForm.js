import axios from "axios";
import configHelper from "../../actions/configHelpers";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const GET_BRIEF_MSE_FORM_FAIL = "GET_BRIEF_MSE_FORM_FAIL";
export const GET_BRIEF_MSE_FORM_RESET = "GET_BRIEF_MSE_FORM_RESET";
export const GET_BRIEF_MSE_FORM_SUCCESS = "GET_BRIEF_MSE_FORM_SUCCESS";
export const GET_BRIEF_MSE_FORM_REQUEST = "GET_BRIEF_MSE_FORM_REQUEST";

export const getBriefMSENotesForm =
  ({ treatmentNo }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: GET_BRIEF_MSE_FORM_REQUEST });

      const config = configHelper(getState);

      const response = await axios.get(
        `${API}data/odatafilter?webservice=PgBriefMSEForm&query=$filter=Encounter_No eq '${treatmentNo}'`,
        config
      );

      dispatch({ type: GET_BRIEF_MSE_FORM_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: GET_BRIEF_MSE_FORM_FAIL, payload: error.message });
    }
  };
