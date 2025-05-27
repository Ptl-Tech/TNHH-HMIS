import {
  POST_TRIAGE_LIST_VITALS_REQUEST,
  POST_TRIAGE_LIST_VITALS_SUCCESS,
  POST_TRIAGE_LIST_VITALS_RESET,
  POST_TRIAGE_LIST_VITALS_FAIL,
} from '../../actions/triage-actions/postTriageListVitalsSlice';

const initialState = {
  loading: false,
  vitals: [],
  error: null,
};

export const postTriageListVitalsReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_TRIAGE_LIST_VITALS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case POST_TRIAGE_LIST_VITALS_SUCCESS:
      return {
        ...state,
        loading: false,
        vitals: action.payload,
      };
    case POST_TRIAGE_LIST_VITALS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case POST_TRIAGE_LIST_VITALS_RESET:
      console.log({ done: 'we have reset the state' });
      return initialState;
    default:
      return state;
  }
};
