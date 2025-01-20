import {
  POST_MARK_AS_COMPLETED_REQUEST,
  POST_MARK_AS_COMPLETED_SUCCESS,
  POST_MARK_AS_COMPLETED_FAIL,
} from "../../actions/Doc-actions/postMarkasCompleted";

const initialState = {
  loadingCheInPatient: false,
  checkInPatient: [],
  error: null,
};

export const postMarkAsCompletedReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_MARK_AS_COMPLETED_REQUEST:
      return {
        ...state,
        loadingCheInPatient: true,
        error: null,
      };
    case POST_MARK_AS_COMPLETED_SUCCESS:
      return {
        ...state,
        loadingCheInPatient: false,
        checkInPatient: action.payload,
        error: null,
      };
    case POST_MARK_AS_COMPLETED_FAIL:
      return {
        ...state,
        loadingCheInPatient: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
