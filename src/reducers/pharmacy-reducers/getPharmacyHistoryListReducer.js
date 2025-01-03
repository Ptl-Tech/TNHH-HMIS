import {
  GET_PHARMACY_HISTORY_LIST_REQUEST,
  GET_PHARMACY_HISTORY_LIST_SUCCESS,
  GET_PHARMACY_HISTORY_LIST_FAILURE,
  GET_PHARMACY_HISTORY_LIST_RESET,
} from "../../actions/pharmacy-actions/getPharmacyHistoryList";

export const getPharmacyHistoryListReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case GET_PHARMACY_HISTORY_LIST_REQUEST:
      return { loading: true, data: [] };
    case GET_PHARMACY_HISTORY_LIST_SUCCESS:
      return { loading: false, data: action.payload };
    case GET_PHARMACY_HISTORY_LIST_FAILURE:
      return { loading: false, error: action.payload };
    case GET_PHARMACY_HISTORY_LIST_RESET:
      return { loading: false };
    default:
      return state;
  }
};
