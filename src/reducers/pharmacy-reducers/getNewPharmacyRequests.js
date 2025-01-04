import {
  GET_NEW_PHARMACY_REQUESTS,
  GET_NEW_PHARMACY_REQUESTS_SUCCESS,
  GET_NEW_PHARMACY_REQUESTS_FAILURE,
  GET_NEW_PHARMACY_REQUESTS_RESET,
} from "../../actions/pharmacy-actions/getNewPharmacyRequest";

export const getNewPharmacyRequestsReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case GET_NEW_PHARMACY_REQUESTS:
      return { loading: true, data: [] };
    case GET_NEW_PHARMACY_REQUESTS_SUCCESS:
      return { loading: false, data: action.payload };
    case GET_NEW_PHARMACY_REQUESTS_FAILURE:
      return { loading: false, error: action.payload };
    case GET_NEW_PHARMACY_REQUESTS_RESET:
      return { loading: false };
    default:
      return state;
  }
};
