import {
  GET_CONSULTATION_NOTES_FAIL,
  GET_CONSULTATION_NOTES_REQUEST,
  GET_CONSULTATION_NOTES_RESET,
  GET_CONSULTATION_NOTES_SUCCESS,
} from "../../actions/Doc-actions/getConsultationNotesForm";

const initialState = { data: [], loading: false, error: null };

export const getConsultationNotesFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CONSULTATION_NOTES_REQUEST:
      return { ...state, loading: true };
    case GET_CONSULTATION_NOTES_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case GET_CONSULTATION_NOTES_FAIL:
      return { ...state, loading: false, error: action.payload };
    case GET_CONSULTATION_NOTES_RESET:
      return initialState;
    default:
      return state;
  }
};
