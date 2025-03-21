import {
  GET_SINGLE_PHARMACY_RECORD,
  GET_SINGLE_PHARMACY_RECORD_FAILURE,
  GET_SINGLE_PHARMACY_RECORD_RESET,
  GET_SINGLE_PHARMACY_RECORD_SUCCESS,
} from '../../actions/pharmacy-actions/getSinglePharmacyRecord';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const getSinglePharmacyRecordReducer = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case GET_SINGLE_PHARMACY_RECORD:
      return { ...initialState, loading: true };
    case GET_SINGLE_PHARMACY_RECORD_SUCCESS:
      return { ...initialState, loading: false, data: action.payload };
    case GET_SINGLE_PHARMACY_RECORD_FAILURE:
      return { ...initialState, loading: false, error: action.payload };
    case GET_SINGLE_PHARMACY_RECORD_RESET:
      return initialState;
    default:
      return state;
  }
};
