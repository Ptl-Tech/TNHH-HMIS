import {
    SAVE_GENERAL_INFORMATION_FAIL,
    SAVE_GENERAL_INFORMATION_REQUEST,
    SAVE_GENERAL_INFORMATION_RESET,
    SAVE_GENERAL_INFORMATION_SUCCESS,
  } from "../../../actions/reception-actions/save-patient-actions/saveGeneralInformation";
  
  const initialState = {
    loading: false,
    success: false,
    data: null,
    error: null,
  };
  
  export const saveGeneralInformationReducer = (state = initialState, action) => {
    switch (action.type) {
      case SAVE_GENERAL_INFORMATION_REQUEST:
        return { ...state, loading: true, success: false, error: null };
      case SAVE_GENERAL_INFORMATION_SUCCESS:
        return { ...state, loading: false, success: true, data: action.payload };
      case SAVE_GENERAL_INFORMATION_FAIL:
        return { ...state, loading: false, success: false, error: action.payload };
      case SAVE_GENERAL_INFORMATION_RESET:
        return initialState;
      default:
        return state;
    }
  };
  