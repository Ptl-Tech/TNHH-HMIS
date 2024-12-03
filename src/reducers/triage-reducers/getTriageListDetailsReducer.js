
import { 
    GET_TRIAGE_LIST_DETAILS_REQUEST,
    GET_TRIAGE_LIST_DETAILS_SUCCESS,
    GET_TRIAGE_LIST_DETAILS_FAILURE 
} from "../../actions/triage-actions/getTriageListDetailsSlice";

const initialState = {
    loading: false,
    triageListDetails: [],
    error: null,
};


export const getTriageListDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_TRIAGE_LIST_DETAILS_REQUEST:
        return { loading: true };
      case GET_TRIAGE_LIST_DETAILS_SUCCESS:
        return { loading: false, triageListDetail: action.payload };
      case GET_TRIAGE_LIST_DETAILS_FAILURE :
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };