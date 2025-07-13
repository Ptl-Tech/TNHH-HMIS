import {
  POST_LAB_APPOINTMENT_REQUEST,
  POST_LAB_APPOINTMENT_SUCCESS,
  POST_LAB_APPOINTMENT_FAIL,
  POST_LAB_APPOINTMENT_RESET,
} from "../../actions/reception-actions/dispatchLabAppointment";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const postLabAppointmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_LAB_APPOINTMENT_REQUEST:
      return { ...state, loading: true };
      break;
    case POST_LAB_APPOINTMENT_SUCCESS:
      return { ...state, loading: false, data: action.payload };
      break;
    case POST_LAB_APPOINTMENT_FAIL:
      return { ...state, loading: false, error: action.payload };
      break;
    case POST_LAB_APPOINTMENT_RESET:
      return initialState;
      break;
    default:
      return state;
      break;
  }
};
