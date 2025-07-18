import {
  GET_DOCTOR_NOTES_SECTIONS_FAIL,
  GET_DOCTOR_NOTES_SECTIONS_REQUEST,
  GET_DOCTOR_NOTES_SECTIONS_RESET,
  GET_DOCTOR_NOTES_SECTIONS_SUCCESS,
} from "../../actions/Doc-actions/getDoctorNotesSections";

const initialData = {
  loading: false,
  data: [],
  error: null,
};

export const getDoctorNotesSectionsReducer = (state = initialData, action) => {
  switch (action.type) {
    case GET_DOCTOR_NOTES_SECTIONS_REQUEST:
      return { ...initialData, loading: true, data: [] };
    case GET_DOCTOR_NOTES_SECTIONS_SUCCESS:
      return { ...initialData, loading: false, data: action.payload };
    case GET_DOCTOR_NOTES_SECTIONS_FAIL:
      return { ...initialData, loading: false, error: action.payload };
    case GET_DOCTOR_NOTES_SECTIONS_RESET:
      return initialData;
    default:
      return state;
  }
};
