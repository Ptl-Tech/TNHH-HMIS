import {
  POST_LAB_TO_DOCTOR_FAIL,
  POST_LAB_TO_DOCTOR_REQUEST,
  POST_LAB_TO_DOCTOR_RESET,
  POST_LAB_TO_DOCTOR_SUCCESS,
} from '../../actions/lab-actions/postLabRequestToDoctor';

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const postLabRequestToDoctorReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_LAB_TO_DOCTOR_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case POST_LAB_TO_DOCTOR_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case POST_LAB_TO_DOCTOR_RESET:
      return initialState;
    case POST_LAB_TO_DOCTOR_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
