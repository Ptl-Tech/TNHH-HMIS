import { GET_TRIAGE_WAITING_LIST_FAILURE, GET_TRIAGE_WAITING_LIST_REQUEST, GET_TRIAGE_WAITING_LIST_SUCCESS } from "../../actions/triage-actions/getTriageWaitingListSlice";

const initialState = {
  loadingWaitingList: false,
  triageWaitingList: [],
  error: '',
};

export const getTriageWaitingListReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TRIAGE_WAITING_LIST_REQUEST:
      return { ...state, loadingWaitingList: true };
    case GET_TRIAGE_WAITING_LIST_SUCCESS:
      return { ...state, loadingWaitingList: false, triageWaitingList: action.payload };
    case GET_TRIAGE_WAITING_LIST_FAILURE:
      return { ...state, loadingWaitingList: false, error: action.payload };
    default:
      return state;
  }
};
