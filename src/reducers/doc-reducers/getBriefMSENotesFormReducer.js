import {
  GET_BRIEF_MSE_FORM_FAIL,
  GET_BRIEF_MSE_FORM_RESET,
  GET_BRIEF_MSE_FORM_REQUEST,
  GET_BRIEF_MSE_FORM_SUCCESS,
} from "../../actions/nurse-actions/getBriefMSENotesForm";

const initialState = { data: [], loading: false, error: null };

export const getBriefMSENotesFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BRIEF_MSE_FORM_REQUEST:
      return { ...state, loading: true };
    case GET_BRIEF_MSE_FORM_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case GET_BRIEF_MSE_FORM_FAIL:
      return { ...state, loading: false, error: action.payload };
    case GET_BRIEF_MSE_FORM_RESET:
      return initialState;
    default:
      return state;
  }
};
