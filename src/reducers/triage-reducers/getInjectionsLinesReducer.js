import { GET_INJECTIONS_LINES_REQUEST, GET_INJECTIONS_LINES_SUCCESS, GET_INJECTIONS_LINES_FAILURE } from "../../actions/triage-actions/getInjectionsSlice";


const initialState = {
    getInjectionsLinesLoading: false,
    getInjectionsLines: [],
    error: '',
};
export const getInjectionsLinesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_INJECTIONS_LINES_REQUEST:
            return { ...state, getInjectionsLinesLoading: true };
        case GET_INJECTIONS_LINES_SUCCESS:
            return { ...state, getInjectionsLinesLoading: false, getInjectionsLines: action.payload };
        case GET_INJECTIONS_LINES_FAILURE:
            return { ...state, getInjectionsLinesLoading: false, error: action.payload };
        default:
            return state;
    }
};