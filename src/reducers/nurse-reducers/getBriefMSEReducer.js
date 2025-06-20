import {
  GET_BRIEF_MSE_DATA_FAIL,
  GET_BRIEF_MSE_DATA_REQUEST,
  GET_BRIEF_MSE_DATA_RESET,
  GET_BRIEF_MSE_DATA_SUCCESS,
} from "../../actions/nurse-actions/getBriefMSENotesData";

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const getBriefMSENotesDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BRIEF_MSE_DATA_REQUEST:
      return { ...state, loading: true };
    case GET_BRIEF_MSE_DATA_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case GET_BRIEF_MSE_DATA_FAIL:
      return { ...state, loading: false, error: action.payload };
    case GET_BRIEF_MSE_DATA_RESET:
      return initialState;
    default:
      return state;
  }
};
