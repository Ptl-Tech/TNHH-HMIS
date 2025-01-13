import {
  POST_PATIENT_HISTORY_NOTES_REQUEST,
  POST_PATIENT_HISTORY_NOTES_SUCCESS,
  POST_PATIENT_HISTORY_NOTES_FAIL,
  POST_PATIENT_HISTORY_NOTES_RESET,
} from "../../actions/Doc-actions/posPatientHistoryNotes";

export const postPatientHistoryNotesReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case POST_PATIENT_HISTORY_NOTES_REQUEST:
      return { ...state, loading: true };
    case POST_PATIENT_HISTORY_NOTES_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_PATIENT_HISTORY_NOTES_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_PATIENT_HISTORY_NOTES_RESET:
      return { loading: false };
    default:
      return state;
  }
};
