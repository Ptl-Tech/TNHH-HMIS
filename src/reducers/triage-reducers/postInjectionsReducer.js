
import {

    POST_INJECTIONS_REQUEST,
    POST_INJECTIONS_SUCCESS,
    POST_INJECTIONS_FAIL
} from '../../actions/triage-actions/postInjectionsSlice';


const initialState = {
    injectionsLoading: false,
    injections: [],
    error: null,
};

export const postInjectionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_INJECTIONS_REQUEST:
            return {
                ...state,
                injectionsLoading: true,
                error: null,
            };
        case POST_INJECTIONS_SUCCESS:
            return {
                ...state,
                injectionsLoading: false,
                injections: action.payload,
                error: null,
            };
        case POST_INJECTIONS_FAIL:
            return {
                ...state,
                injectionsLoading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};