import {
  REQUEST_REFERRAL_LINES,
  REQUEST_REFERRAL_LINES_SUCCESS,
  REQUEST_REFERRAL_LINES_FAIL,
  REQUEST_REFERRAL_LINES_RESET,
} from "../../actions/Doc-actions/getReferralLines";

export const getReferralLinesReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case REQUEST_REFERRAL_LINES:
      return { loading: true, data: [] };
    case REQUEST_REFERRAL_LINES_SUCCESS:
      return { loading: false, data: action.payload };
    case REQUEST_REFERRAL_LINES_FAIL:
      return { loading: false, error: action.payload };
    case REQUEST_REFERRAL_LINES_RESET:
      return { loading: false };
    default:
      return state;
  }
};
