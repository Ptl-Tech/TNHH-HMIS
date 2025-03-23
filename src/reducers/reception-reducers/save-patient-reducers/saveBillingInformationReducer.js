import {
  SAVE_BILLING_INFORMATION_REQUEST,
  SAVE_BILLING_INFORMATION_SUCCESS,
  SAVE_BILLING_INFORMATION_FAIL,
  SAVE_BILLING_INFORMATION_RESET,
} from "../../../actions/reception-actions/save-patient-actions/saveBillingInformation";

const initialState = {
  loading: false,
  success: false,
  data: null,
  error: null,
};

export const saveBillingInformationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_BILLING_INFORMATION_REQUEST:
      return { ...state, loading: true, success: false, error: null };
    case SAVE_BILLING_INFORMATION_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case SAVE_BILLING_INFORMATION_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };
    case SAVE_BILLING_INFORMATION_RESET:
      return initialState;
    default:
      return state;
  }
};
