import {
  REQUEST_TREATMENT_DIAGNOSIS_LINES,
  REQUEST_TREATMENT_DIAGNOSIS_LINES_SUCCESS,
  REQUEST_TREATMENT_DIAGNOSIS_LINES_FAIL,
  REQUEST_TREATMENT_DIAGNOSIS_LINES_RESET,
} from "../../actions/Doc-actions/getTreatmentDiagnosisLines";

export const getPatientTreamentDiagnosisLinesReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case REQUEST_TREATMENT_DIAGNOSIS_LINES:
      return { loading: true, data: [] };
    case REQUEST_TREATMENT_DIAGNOSIS_LINES_SUCCESS:
      return { loading: false, data: action.payload };
    case REQUEST_TREATMENT_DIAGNOSIS_LINES_FAIL:
      return { loading: false, error: action.payload };
    case REQUEST_TREATMENT_DIAGNOSIS_LINES_RESET:
      return { loading: false };
    default:
      return state;
  }
};
