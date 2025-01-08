import {
  GET_PHARMACY_HISTORY_LIST_REQUEST,
  GET_PHARMACY_HISTORY_LIST_SUCCESS,
  GET_PHARMACY_HISTORY_LIST_FAILURE,
  GET_PHARMACY_HISTORY_LIST_RESET,
} from "../../actions/pharmacy-actions/getPharmacyHistoryList";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

const getPharmacyHistoryListReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PHARMACY_HISTORY_LIST_REQUEST:
      return { ...state, loading: true };
    case GET_PHARMACY_HISTORY_LIST_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case GET_PHARMACY_HISTORY_LIST_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
