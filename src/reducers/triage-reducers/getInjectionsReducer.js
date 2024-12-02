import {
    GET_INJECTIONS_REQUEST,
    GET_INJECTIONS_SUCCESS,
    GET_INJECTIONS_FAILURE,
} from "../../actions/triage-actions/getInjectionsSlice";

const initialState = {
    loadingInjections: false,
    injections: [],
    error: '',
};

export const getInjectionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_INJECTIONS_REQUEST:
            return { ...state, loadingInjections: true };
        case GET_INJECTIONS_SUCCESS:
            return { ...state, loadingInjections: false, injections: action.payload };
        case GET_INJECTIONS_FAILURE:
            return { ...state, loadingInjections: false, injections: action.payload };
        default:
            return state;
    }
};