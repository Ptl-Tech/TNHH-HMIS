import { VERIFIED_ADMISSIONS_REQUEST, VERIFIED_ADMISSIONS_SUCCESS, VERIFIED_ADMISSIONS_FAIL, VERIFIED_ADMISSIONS_RESET } from "../../../actions/Doc-actions/Admission/getVerifiedAdmissions";

export const getVerifiedAdmissionsReducer = (state = { admissions: [] }, action) => {
  switch (action.type) {
    case VERIFIED_ADMISSIONS_REQUEST:
      return { loading: true, admissions: [] };
    case VERIFIED_ADMISSIONS_SUCCESS:
      return { loading: false, admissions: action.payload };
    case VERIFIED_ADMISSIONS_FAIL:
      return { loading: false, error: action.payload };
    case VERIFIED_ADMISSIONS_RESET:
      return { admissions: [] };
    default:
      return state;
  }
}
