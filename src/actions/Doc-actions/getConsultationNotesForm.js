import axios from "axios";

const API = import.meta.env.VITE_PORTAL_API_BASE_URL;

export const GET_CONSULTATION_NOTES_FAIL = "GET_CONSULTATION_NOTES_FAIL";
export const GET_CONSULTATION_NOTES_RESET = "GET_CONSULTATION_NOTES_RESET";
export const GET_CONSULTATION_NOTES_REQUEST = "GET_CONSULTATION_NOTES_REQUEST";
export const GET_CONSULTATION_NOTES_SUCCESS = "GET_CONSULTATION_NOTES_SUCCESS";

export const getConsultationNotesForm =
  ({ treatmentNo }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: GET_CONSULTATION_NOTES_REQUEST });

      const {
        auth: { user },
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
        `${API}/data/odatafilter?webservice=PgConsultationNotesForm&isList=true&query=$filter=Treatment_No eq '${treatmentNo}'`,
        config
      );

      console.log({ data: response.data });

      dispatch({
        type: GET_CONSULTATION_NOTES_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      console.log({ error });

      dispatch({ type: GET_CONSULTATION_NOTES_FAIL, payload: error.message });
    }
  };
