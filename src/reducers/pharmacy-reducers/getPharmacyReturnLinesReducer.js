import {
  GET_PHARMACY_RETURN_LIST_REQUEST,
  GET_PHARMACY_RETURN_LIST_SUCCESS,
  GET_PHARMACY_RETURN_LIST_FAILURE,
  GET_PHARMACY_RETURN_LIST_RESET,
  GET_PATIENT_PHARMACY_RETURN_REQUEST,
  GET_PATIENT_PHARMACY_RETURN_SUCCESS,
  GET_PATIENT_PHARMACY_RETURN_FAILURE,
  GET_PATIENT_PHARMACY_RETURN_RESET,
} from '../../actions/pharmacy-actions/getPharmacyLineReturns';

// Reducer for handling Pharmacy Return Lines list
export const getPharmacyReturnLinesListReducer = (
  state = { loading: false, data: [], error: null },
  action,
) => {
  switch (action.type) {
    case GET_PHARMACY_RETURN_LIST_REQUEST:
      return { ...state, loading: true, data: [] };
    case GET_PHARMACY_RETURN_LIST_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case GET_PHARMACY_RETURN_LIST_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case GET_PHARMACY_RETURN_LIST_RESET:
      return { loading: false, data: [], error: null };
    default:
      return state;
  }
};

const initialState = { loading: false, data: [], error: null };

// Reducer for handling Patient Pharmacy Return Lines
export const getPatientPharmacyReturnLinesReducer = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case GET_PATIENT_PHARMACY_RETURN_REQUEST:
      return { ...state, loading: true};
    case GET_PATIENT_PHARMACY_RETURN_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case GET_PATIENT_PHARMACY_RETURN_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case GET_PATIENT_PHARMACY_RETURN_RESET:
      return initialState;
    default:
      return state;
  }
};
