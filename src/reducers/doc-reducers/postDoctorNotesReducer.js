import {
  POST_DOCTOR_NOTES_FAIL,
  POST_DOCTOR_NOTES_REQUEST,
  POST_DOCTOR_NOTES_RESET,
  POST_DOCTOR_NOTES_SUCCESS,
} from "../../actions/Doc-actions/postDoctorNotes";

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const postDoctorNotesReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_DOCTOR_NOTES_REQUEST:
      return { ...initialState, loading: true };
    case POST_DOCTOR_NOTES_SUCCESS:
      return {
        ...initialState,
        loading: false,
        data: action.payload,
      };
    case POST_DOCTOR_NOTES_FAIL:
      return { ...initialState, loading: false, error: action.payload };
    case POST_DOCTOR_NOTES_RESET:
      return initialState;
    default:
      return state;
  }
};
