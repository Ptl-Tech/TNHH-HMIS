import {
  POST_PATIENT_ADMISSION,
  POST_PATIENT_ADMISSION_SUCCESS,
  POST_PATIENT_ADMISSION_FAIL,
  POST_PATIENT_ADMISSION_RESET,
} from "../../../actions/Doc-actions/Admission/postAdmitPatient";

export const postPatientAdmissionReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case POST_PATIENT_ADMISSION:
      return { ...state, loading: true };
    case POST_PATIENT_ADMISSION_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_PATIENT_ADMISSION_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_PATIENT_ADMISSION_RESET:
      return { loading: false };
    default:
      return state;
  }
};
