import { CANCEL_PATIENT_ADMISSION, CANCEL_PATIENT_ADMISSION_SUCCESS, CANCEL_PATIENT_ADMISSION_FAIL, CANCEL_PATIENT_ADMISSION_RESET } from "../../../actions/Doc-actions/Admission/cancelPatientAdmission";

export const postAdmissionCancellationReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case CANCEL_PATIENT_ADMISSION:
      return { ...state, loading: true };
    case CANCEL_PATIENT_ADMISSION_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case CANCEL_PATIENT_ADMISSION_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CANCEL_PATIENT_ADMISSION_RESET:
      return { loading: false };
    default:
      return state;
  }
};
