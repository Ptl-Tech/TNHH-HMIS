import {
  SAVE_DOCTOR_NOTES_ERROR,
  SAVE_DOCTOR_NOTES_REQUEST,
  SAVE_DOCTOR_NOTES_RESET,
  SAVE_DOCTOR_NOTES_SUCCESS,
} from '../../actions/Doc-actions/saveDoctorNotes';

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const saveDoctorNotesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_DOCTOR_NOTES_REQUEST:
      return { ...state, loading: true };
    case SAVE_DOCTOR_NOTES_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case SAVE_DOCTOR_NOTES_ERROR:
      return { ...state, loading: false, error: action.payload };
    case SAVE_DOCTOR_NOTES_RESET:
      return initialState;
    default:
      return state;
  }
};
