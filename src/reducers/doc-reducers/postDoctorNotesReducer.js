import {
  POST_DOCTOR_NOTES_FAIL,
  POST_DOCTOR_NOTES_REQUEST,
  POST_DOCTOR_NOTES_RESET,
  POST_DOCTOR_NOTES_SUCCESS,
} from "../../actions/Doc-actions/postDoctorNotes";

export const postDoctorNotesReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case POST_DOCTOR_NOTES_REQUEST:
      return { ...state, loading: true };
    case POST_DOCTOR_NOTES_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_DOCTOR_NOTES_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_DOCTOR_NOTES_RESET:
      return { loading: false };
    default:
      return state;
  }
};
