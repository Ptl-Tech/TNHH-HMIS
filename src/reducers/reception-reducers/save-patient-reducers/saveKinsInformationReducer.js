import {
  SAVE_KINS_INFORMATION_REQUEST,
  SAVE_KINS_INFORMATION_SUCCESS,
  SAVE_KINS_INFORMATION_FAIL,
  SAVE_KINS_INFORMATION_RESET,
} from "../../../actions/reception-actions/save-patient-actions/saveKinsInformation";

const initialState = {
  loading: false,
  success: false,
  data: null,
  error: null,
};

export const saveKinsInformationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_KINS_INFORMATION_REQUEST:
      return { ...state, loading: true, success: false, error: null };
    case SAVE_KINS_INFORMATION_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case SAVE_KINS_INFORMATION_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };
    case SAVE_KINS_INFORMATION_RESET:
      return initialState;
    default:
      return state;
  }
};
