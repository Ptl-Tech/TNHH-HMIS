import {
    GET_INJECTIONS_REQUEST,
    GET_INJECTIONS_SUCCESS,
    GET_INJECTIONS_FAILURE,
} from "../../actions/triage-actions/getInjectionsSlice";

const initialState = {
    getInjectionsLoading: false,
    getInjections: [],
    error: '',
};

export const getInjectionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_INJECTIONS_REQUEST:
            return { ...state, getInjectionsLoading: true };
        case GET_INJECTIONS_SUCCESS:
            return { ...state, getInjectionsLoading: false, getInjections: action.payload };
        case GET_INJECTIONS_FAILURE:
            return { ...state, getInjectionsLoading: false, error: action.payload };
        default:
            return state;
    }
};