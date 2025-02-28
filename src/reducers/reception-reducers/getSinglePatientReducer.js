import {
  GET_SINGLE_PATIENT_FAIL,
  GET_SINGLE_PATIENT_REQUEST,
  GET_SINGLE_PATIENT_RESET,
  GET_SINGLE_PATIENT_SUCCESS,
} from '../../actions/reception-actions/getSinglePatient';

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const getSinglePatientReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SINGLE_PATIENT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_SINGLE_PATIENT_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case GET_SINGLE_PATIENT_RESET:
      return initialState;
    case GET_SINGLE_PATIENT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
