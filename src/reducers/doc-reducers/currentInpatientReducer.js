import {
  SET_CURRENT_INPATIENT,
  SET_CURRENT_INPATIENT_ERROR,
} from "../../actions/Doc-actions/currentInpatient";

const initialState = {
  data: null,
  error: null,
};

export const currentInpatientReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_INPATIENT:
      console.log({ action });
      return { ...state, data: action.payload.data };
    case SET_CURRENT_INPATIENT_ERROR:
      return { ...state, error: action.payload.error };
    default:
      return state;
  }
};
