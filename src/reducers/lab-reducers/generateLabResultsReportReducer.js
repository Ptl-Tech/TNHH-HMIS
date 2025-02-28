import {
  GENERATE_LAB_RESULTS_REPORT_FAIL,
  GENERATE_LAB_RESULTS_REPORT_REQUEST,
  GENERATE_LAB_RESULTS_REPORT_RESET,
  GENERATE_LAB_RESULTS_REPORT_SUCCESS,
} from '../../actions/lab-actions/generateLabResultsReport';

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const generateLabResultsReportReducer = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case GENERATE_LAB_RESULTS_REPORT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GENERATE_LAB_RESULTS_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case GENERATE_LAB_RESULTS_REPORT_RESET:
      return initialState;
    case GENERATE_LAB_RESULTS_REPORT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
