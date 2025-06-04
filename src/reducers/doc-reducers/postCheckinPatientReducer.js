import {
  POST_CHECK_IN_PATIENT_REQUEST,
  POST_CHECK_IN_PATIENT_SUCCESS,
  POST_CHECK_IN_PATIENT_RESET,
  POST_CHECK_IN_PATIENT_FAIL,
} from '../../actions/Doc-actions/postCheckInPatient';

const initialState = {
  error: null,
  checkInPatient: [],
  loadingCheInPatient: false,
};

export const postCheckInPatientConfirmReducer = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case POST_CHECK_IN_PATIENT_REQUEST:
      return {
        ...state,
        loadingCheInPatient: true,
        error: null,
      };
    case POST_CHECK_IN_PATIENT_SUCCESS:
      return {
        ...state,
        loadingCheInPatient: false,
        checkInPatient: action.payload,
        error: null,
      };
    case POST_CHECK_IN_PATIENT_FAIL:
      return {
        ...state,
        loadingCheInPatient: false,
        error: action.payload,
      };
    case POST_CHECK_IN_PATIENT_RESET:
      return initialState;
    default:
      return state;
  }
};
