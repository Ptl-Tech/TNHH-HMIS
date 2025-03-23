import {
  SAVE_ADDRESS_INFORMATION_FAIL,
  SAVE_ADDRESS_INFORMATION_REQUEST,
  SAVE_ADDRESS_INFORMATION_RESET,
  SAVE_ADDRESS_INFORMATION_SUCCESS,
} from "../../../actions/reception-actions/save-patient-actions/saveAddressInformation";

const initialState = {
  loading: false,
  success: false,
  data: null,
  error: null,
};

export const saveAddressInformationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_ADDRESS_INFORMATION_REQUEST:
      return { ...state, loading: true, success: false, error: null };
    case SAVE_ADDRESS_INFORMATION_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case SAVE_ADDRESS_INFORMATION_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload || "An unexpected error occurred.",
      };
    case SAVE_ADDRESS_INFORMATION_RESET:
      return initialState;
    default:
      return state;
  }
};
