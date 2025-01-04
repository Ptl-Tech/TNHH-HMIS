import { QY_HOS_NO_REQUEST, QY_HOS_NO_RESET } from "../../actions/Doc-actions/getHospitalNumber";
import { QY_DIAGNOSIS_LIST_FAIL, QY_SIGNS_LIST_SUCCESS } from "../../constants/doc-constants/QySymptomConstants";

export const QyHospNumberReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case QY_HOS_NO_REQUEST:
      return { loading: true, data: [] };
    case QY_SIGNS_LIST_SUCCESS:
      return { loading: false, data: action.payload };
    case QY_DIAGNOSIS_LIST_FAIL:
      return { loading: false, error: action.payload };
    case QY_HOS_NO_RESET:
      return { data: [] };
    default:
      return state;
  }
}