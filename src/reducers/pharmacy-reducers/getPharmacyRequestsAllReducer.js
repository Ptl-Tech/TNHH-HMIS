import {
  GET_PHARMACY_REQUESTS_ALL,
  GET_PHARMACY_REQUESTS_ALL_FAILURE,
  GET_PHARMACY_REQUESTS_ALL_RESET,
  GET_PHARMACY_REQUESTS_ALL_SUCCESS,
} from '../../actions/pharmacy-actions/getPharmacyRequestsAll';

// Initial state
const initialState = {
  loading: false,
  data: [],
  error: null,
};

// Reducer function
const getPharmacyRequestsAllReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PHARMACY_REQUESTS_ALL:
      return { ...state, loading: true };

    case GET_PHARMACY_REQUESTS_ALL_SUCCESS:
      return { ...state, loading: false, data: action.payload };

    case GET_PHARMACY_REQUESTS_ALL_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case GET_PHARMACY_REQUESTS_ALL_RESET:
      return initialState;
    default:
      return state;
  }
};

export default getPharmacyRequestsAllReducer;
