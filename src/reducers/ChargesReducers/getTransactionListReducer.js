import { GET_TRANSACTION_LIST_FAIL, GET_TRANSACTION_LIST_REQUEST, GET_TRANSACTION_LIST_RESET, GET_TRANSACTION_LIST_SUCCESS } from "../../actions/Charges-Actions/getTransactionList";

export const getTransactionListReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case GET_TRANSACTION_LIST_REQUEST:
      return { loading: true, data: [] };
    case GET_TRANSACTION_LIST_SUCCESS:
      return { loading: false, data: action.payload };
    case GET_TRANSACTION_LIST_FAIL:
      return { loading: false, error: action.payload };
    case GET_TRANSACTION_LIST_RESET:
      return { data: [] };
    default:
      return state;
  }
};
