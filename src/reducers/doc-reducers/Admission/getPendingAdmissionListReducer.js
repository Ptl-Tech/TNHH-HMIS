import {
  GET_PENDING_ADMISSION_LIST_REQUEST,
  GET_PENDING_ADMISSION_LIST_SUCCESS,
  GET_PENDING_ADMISSION_LIST_FAILURE,
  GET_PENDING_ADMISSION_LIST_RESET,
} from "../../../actions/Doc-actions/Admission/getPendingAdmissions";

export const getPendingAdmissionListReducer = (  state = { loading: false, data: [] },
  action
) => {
  switch (action.type) {
    case GET_PENDING_ADMISSION_LIST_REQUEST:
      return { ...state, loading: true };
    case GET_PENDING_ADMISSION_LIST_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case GET_PENDING_ADMISSION_LIST_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case GET_PENDING_ADMISSION_LIST_RESET:
      return { loading: false };
    default:
      return state;
  }
};
