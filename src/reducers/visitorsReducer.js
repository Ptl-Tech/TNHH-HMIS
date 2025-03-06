import { ADMIT_VISITOR_FAIL, ADMIT_VISITOR_REQUEST, ADMIT_VISITOR_RESET, ADMIT_VISITOR_SUCCESS, REGISTER_VISITOR_FAIL, REGISTER_VISITOR_REQUEST, REGISTER_VISITOR_RESET, REGISTER_VISITOR_SUCCESS, VISITOR_CLEARANCE_FAIL, VISITOR_CLEARANCE_REQUEST, VISITOR_CLEARANCE_SUCCESS, VISITOR_DETAILS_FAIL, VISITORS_LIST_FAIL, VISITORS_LIST_REQUEST, VISITORS_LIST_RESET, VISITORS_LIST_SUCCESS } from "../constants/visitorsConstants";

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


  export const admitVisitorReducer = (state = {}, action) => {
    switch (action.type) {
      case ADMIT_VISITOR_REQUEST:
        return { loading: true };
      case ADMIT_VISITOR_SUCCESS:
        return { loading: false, success: true, vistorId: action.payload };
      case ADMIT_VISITOR_FAIL:
        return { loading: false, error: action.payload };
      case ADMIT_VISITOR_RESET:
        return {};
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

  
  export const clearVisitorReducer = (state = {}, action) => {
    switch (action.type) {
      case VISITOR_CLEARANCE_REQUEST:
        return { loading: true };
      case VISITOR_CLEARANCE_SUCCESS:
        return { loading: false, success: true, data: action.payload };
      case VISITOR_CLEARANCE_FAIL:
        return { loading: false, error: action.payload };
      case VISITOR_DETAILS_FAIL:
        return {};
      default:
        return state;
    }
  };
