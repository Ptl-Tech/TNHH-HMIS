import { OUTPATIENT_LIST_FAIL, OUTPATIENT_LIST_REQUEST, OUTPATIENT_LIST_RESET, OUTPATIENT_LIST_SUCCESS } from "../../constants/doc-constants/outPatient";

export const treatmentListReducer = (state = { patients: [] }, action) => {
    switch (action.type) {
      case OUTPATIENT_LIST_REQUEST:
        return { loading: true, patients: [] };
      case OUTPATIENT_LIST_SUCCESS:
        return { loading: false, patients: action.payload };
      case OUTPATIENT_LIST_FAIL:
        return { loading: false, error: action.payload };
      case OUTPATIENT_LIST_RESET:
        return { patients: [] };
      default:
        return state;
    }
  }
