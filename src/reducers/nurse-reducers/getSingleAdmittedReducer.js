import * as actions from "../../actions/nurse-actions/getSingleAdmittedSlice";

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const getSingleAdmittedReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_SINGLE_ADMITTED_REQUEST:
      return { ...state, loading: true };
    case actions.GET_SINGLE_ADMITTED_ERROR:
      return { ...state, error: action.payload, loading: false };
    case actions.GET_SINGLE_ADMITTED_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case actions.GET_SINGLE_ADMITTED_RESET:
      return initialState;
    default:
      return state;
  }
};
