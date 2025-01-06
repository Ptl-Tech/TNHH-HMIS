import { VIEW_PATIENT_APPMNT_DATA, VIEW_PATIENT_APPMNT_DATA_FAIL, VIEW_PATIENT_APPMNT_DATA_RESET, VIEW_PATIENT_APPMNT_DATA_SUCCESS } from "../../actions/getAppmntDetails";

export const getPatientVisitReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case VIEW_PATIENT_APPMNT_DATA:
      return { loading: true, data: [] };
    case VIEW_PATIENT_APPMNT_DATA_SUCCESS:
      return { loading: false, data: action.payload };
    case VIEW_PATIENT_APPMNT_DATA_FAIL:
      return { loading: false, error: action.payload };
    case VIEW_PATIENT_APPMNT_DATA_RESET:
      return { loading: false };
    default:
      return state;
  }
};
