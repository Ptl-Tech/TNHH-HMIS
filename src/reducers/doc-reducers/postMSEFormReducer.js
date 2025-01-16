import { POST_MSE_NOTES_REQUEST } from "../../actions/Doc-actions/postMentalStateForm";

export const postMSENotesReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case POST_MSE_NOTES_REQUEST:
      return { ...state, loading: true };
    case POST_MSE_NOTES_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_MSE_NOTES_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_MSE_NOTES_RESET:
      return { loading: false };
    default:
      return state;
  }
};
