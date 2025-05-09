import {
  RETURN_DRUGS_REQUEST,
  RETURN_DRUGS_FAIL,
  RETURN_DRUGS_RESET,
  RETURN_DRUGS_SUCCESS,
} from '../../actions/pharmacy-actions/returnDrugs';

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const returnDrugsReducer = (state = initialState, action) => {
  switch (action.type) {
    case RETURN_DRUGS_REQUEST:
      return { ...state, loading: true };
    case RETURN_DRUGS_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case RETURN_DRUGS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case RETURN_DRUGS_RESET:
      return initialState;
    default:
      return state;
  }
};
