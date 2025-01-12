import { 
    QY_SECONDARY_DIAGNOSIS_SETUP, 
    QY_SECONDARY_DIAGNOSIS_SETUP_FAIL, 
    QY_SECONDARY_DIAGNOSIS_SETUP_RESET, 
    QY_SECONDARY_DIAGNOSIS_SETUP_SUCCESS 
  } from "../../actions/Doc-actions/qySecondaryDiagnosisSetup";
  
  export const QySecondaryDiagnosisSetupReducer = (state = { loading: false, data: [], error: null }, action) => {
    switch (action.type) {
      case QY_SECONDARY_DIAGNOSIS_SETUP:
        return { ...state, loading: true, error: null };  
      case QY_SECONDARY_DIAGNOSIS_SETUP_SUCCESS:
        return { loading: false, data: action.payload, error: null };  
      case QY_SECONDARY_DIAGNOSIS_SETUP_FAIL:
        return { loading: false, error: action.payload, data: [] };  
      case QY_SECONDARY_DIAGNOSIS_SETUP_RESET:
        return { loading: false, data: [], error: null }; 
      default:
        return state;
    }
  };
  