import { TRIAGE_VISIT_LIST_REQUEST, TRIAGE_VISIT_LIST_SUCCESS, TRIAGE_VISIT_LIST_FAIL, TRIAGE_VISIT_LIST_RESET } from "../constants/TriageConstants";

export const triageWaitingListReducer = (state = { data: [] }, action) => {
    switch (action.type) {
      case TRIAGE_VISIT_LIST_REQUEST:
        return { loading: true, data: [] };
      case TRIAGE_VISIT_LIST_SUCCESS:
        return { loading: false, data: action.payload };
      case TRIAGE_VISIT_LIST_FAIL:
        return { loading: false, error: action.payload };
      case TRIAGE_VISIT_LIST_RESET:
        return { data: [] };
      default:
        return state;
    }
  }