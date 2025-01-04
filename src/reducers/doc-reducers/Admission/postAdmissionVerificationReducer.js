import { VERIFY_PATIENT_ADMISSION, VERIFY_PATIENT_ADMISSION_SUCCESS, VERIFY_PATIENT_ADMISSION_FAIL, VERIFY_PATIENT_ADMISSION_RESET } from "../../../actions/Doc-actions/Admission/postAdmissionVerification";

export const postAdmissionVerificationReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case VERIFY_PATIENT_ADMISSION:
      return { ...state, loading: true };
    case VERIFY_PATIENT_ADMISSION_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case VERIFY_PATIENT_ADMISSION_FAIL:
      return { ...state, loading: false, error: action.payload };
    case VERIFY_PATIENT_ADMISSION_RESET:
      return { loading: false };
    default:
      return state;
  }
};
