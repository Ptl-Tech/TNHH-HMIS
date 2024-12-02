import {
    GET_TRIAGE_LIST_FAILURE,
    GET_TRIAGE_LIST_REQUEST,
    GET_TRIAGE_LIST_SUCCESS,
} from "../../actions/triage-actions/getTriageListSlice";

const initialState = {
    loadingTriageList: false,
    triageList: [],
    error: '',
};

export const getTriageListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_TRIAGE_LIST_REQUEST:
            return { ...state, loadingTriageList: true };
        case GET_TRIAGE_LIST_FAILURE:
            return { ...state, loadingTriageList: false, triageList: action.payload };
        case GET_TRIAGE_LIST_SUCCESS:
            return { ...state, loadingTriageList: false, triageList: action.payload };
        default:
            return state;
    }
};