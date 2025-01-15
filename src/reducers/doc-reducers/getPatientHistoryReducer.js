import {
  REQUEST_PATIENT_HISTORY_LINES,
  REQUEST_PATIENT_HISTORY_LINES_SUCCESS,
  REQUEST_PATIENT_HISTORY_LINES_FAIL,
  REQUEST_PATIENT_HISTORY_LINES_RESET,
} from "../../actions/Doc-actions/getPatientHistoryNotes";

export const getPatientHistoryNotes = (state = { data: [] }, action) => {
    console.log('Reducer patient No:', action.payload)
  switch (action.type) {
    case REQUEST_PATIENT_HISTORY_LINES:
      return { loading: true, data: [] };
    case REQUEST_PATIENT_HISTORY_LINES_SUCCESS:
      return { loading: false, data: action.payload };
    case REQUEST_PATIENT_HISTORY_LINES_FAIL:
      return { loading: false, error: action.payload };
    case REQUEST_PATIENT_HISTORY_LINES_RESET:
      return { loading: false };
    default:
      return state;
  }
};
