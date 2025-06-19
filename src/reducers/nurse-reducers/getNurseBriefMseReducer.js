import { GET_NURSE_BRIEF_MSE_FORM_REQUEST, GET_NURSE_BRIEF_MSE_FORM_SUCCESS, GET_NURSE_BRIEF_MSE_FORM_FAIL, GET_NURSE_BRIEF_MSE_FORM_RESET } from "../../actions/nurse-actions/getBriefMSENotes";

const initialState = {
  data: {},
  error: null,
  loading: false,
};

export const getNurseBriefMSEDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NURSE_BRIEF_MSE_FORM_REQUEST:
      return { ...state, loading: true };
    case GET_NURSE_BRIEF_MSE_FORM_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case GET_NURSE_BRIEF_MSE_FORM_FAIL:
      return { ...state, loading: false, error: action.payload };
    case GET_NURSE_BRIEF_MSE_FORM_RESET:
      return initialState;
    default:
      return state;
  }
};
