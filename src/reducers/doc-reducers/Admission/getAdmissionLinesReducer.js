import { REQUEST_ADMISSION_LINES, REQUEST_ADMISSION_LINES_SUCCESS, REQUEST_ADMISSION_LINES_FAIL, REQUEST_ADMISSION_LINES_RESET } from "../../../actions/Doc-actions/Admission/getAdmissionLines";

export const getAdmissionLinesReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case REQUEST_ADMISSION_LINES:
      return { loading: true, data: [] };
    case REQUEST_ADMISSION_LINES_SUCCESS:
      return { loading: false, data: action.payload };
    case REQUEST_ADMISSION_LINES_FAIL:
      return { loading: false, error: action.payload };
    case REQUEST_ADMISSION_LINES_RESET:
      return { loading: false };
    default:
      return state;
  }
};
