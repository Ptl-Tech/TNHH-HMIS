import { SAVE_MARKETING_INFORMATION_FAIL, SAVE_MARKETING_INFORMATION_REQUEST, SAVE_MARKETING_INFORMATION_RESET, SAVE_MARKETING_INFORMATION_SUCCESS } from "../../../actions/reception-actions/save-patient-actions/saveMarketingInformation";

const initialState = {
    loading: false,
    success: false,
    data: null,
    error: null,
  };

  export const saveMarketingReducer = (state = initialState, action) => {
    switch (action.type) {
      case SAVE_MARKETING_INFORMATION_REQUEST:
        return { ...state, loading: true, success: false, error: null };
      case SAVE_MARKETING_INFORMATION_SUCCESS:
        return { ...state, loading: false, success: true, data: action.payload };
      case SAVE_MARKETING_INFORMATION_FAIL:
        return { ...state, loading: false, success: false, error: action.payload };
      case SAVE_MARKETING_INFORMATION_RESET:
        return initialState;
      default:
        return state;
    }
  }