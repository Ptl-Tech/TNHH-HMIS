import {
  POST_PHARMACY_APPOINTMENT_REQUEST,
  POST_PHARMACY_APPOINTMENT_SUCCESS,
  POST_PHARMACY_APPOINTMENT_FAIL,
  POST_PHARMACY_APPOINTMENT_RESET,
} from '../../actions/reception-actions/dispatchPharmacyAppointment';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const postPharmacyAppointmentReducer = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case POST_PHARMACY_APPOINTMENT_REQUEST:
      return { ...state, loading: true };
      break;
    case POST_PHARMACY_APPOINTMENT_SUCCESS:
      return { ...state, loading: false, data: action.payload };
      break;
    case POST_PHARMACY_APPOINTMENT_FAIL:
      return { ...state, loading: false, error: action.payload };
      break;
    case POST_PHARMACY_APPOINTMENT_RESET:
      return initialState;
      break;
    default:
      return state;
      break;
  }
};
