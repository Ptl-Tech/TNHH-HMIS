import {
    GET_DRESSING_REQUEST,
    GET_DRESSING_SUCCESS,
    GET_DRESSING_FAILURE,
} from "../../actions/triage-actions/getDressingSlice";

const initialState = {
    loadingDressing: false,
    dressing: [],
    error: '',
};

export const getDressingReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DRESSING_REQUEST:
            return { ...state, loadingDressing: true };
        case GET_DRESSING_SUCCESS:
            return { ...state, loadingDressing: false, vitalsLines: action.payload };
        case GET_DRESSING_FAILURE:
            return { ...state, loadingDressing: false, dressing: action.payload };
        default:
            return state;
    }
};