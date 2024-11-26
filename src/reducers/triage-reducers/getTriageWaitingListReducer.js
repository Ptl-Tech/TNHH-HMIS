import { GET_TRIAGE_WAITING_LIST_FAILURE, GET_TRIAGE_WAITING_LIST_REQUEST, GET_TRIAGE_WAITING_LIST_SUCCESS } from "../../actions/triage-actions/getTriageWaitingListSlice";

const initialState = {
  loading: false,
  triageWaitingList: [],
  error: '',
};

export const getTriageWaitingListReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TRIAGE_WAITING_LIST_REQUEST:
      return { ...state, loading: true };
    case GET_TRIAGE_WAITING_LIST_SUCCESS:
      return { ...state, loading: false, triageWaitingList: action.payload };
    case GET_TRIAGE_WAITING_LIST_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
