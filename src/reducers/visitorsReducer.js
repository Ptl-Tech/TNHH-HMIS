import { REGISTER_VISITOR_FAIL, REGISTER_VISITOR_REQUEST, REGISTER_VISITOR_RESET, REGISTER_VISITOR_SUCCESS, VISITORS_LIST_FAIL, VISITORS_LIST_REQUEST, VISITORS_LIST_RESET, VISITORS_LIST_SUCCESS } from "../constants/visitorsConstants";

export const visitorCreateReducer = (state = { loading: false }, action) => {
    switch (action.type) {
      case REGISTER_VISITOR_REQUEST:
        return { ...state, loading: true };
      case REGISTER_VISITOR_SUCCESS:
        return { ...state, loading: false, success: true, visitor: action.payload };
      case REGISTER_VISITOR_FAIL:
        return { ...state, loading: false, error: action.payload };
      case REGISTER_VISITOR_RESET:
        return { loading: false };
      default:
        return state;
    }
  };

  export const visitorListReducer = (state = { visitors: [] }, action) => {
    switch (action.type) {
      case VISITORS_LIST_REQUEST:
        return { loading: true, visitors: [] };
      case VISITORS_LIST_SUCCESS:
        return { loading: false, visitors: action.payload };
      case VISITORS_LIST_FAIL:
        return { loading: false, error: action.payload };
      case VISITORS_LIST_RESET:
        return { visitors: [] };
      default:
        return state;
    }
  }