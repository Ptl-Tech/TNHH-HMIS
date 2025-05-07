import {
  GET_DOCTOR_NOTES_REQUEST,
  GET_DOCTOR_NOTES_SUCCESS,
  GET_DOCTOR_NOTES_FAIL,
  GET_DOCTOR_NOTES_RESET,
} from '../../actions/Doc-actions/getDoctorsNotesData';

const initialState = {
  data: {},
  error: null,
  loading: false,
};

export const getDoctorsNotesDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DOCTOR_NOTES_REQUEST:
      return { ...state, loading: true };
    case GET_DOCTOR_NOTES_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case GET_DOCTOR_NOTES_FAIL:
      return { ...state, loading: false, error: action.payload };
    case GET_DOCTOR_NOTES_RESET:
      return initialState;
    default:
      return state;
  }
};
