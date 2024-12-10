
import {

    POST_INJECTIONS_REQUEST,
    POST_INJECTIONS_SUCCESS,
    POST_INJECTIONS_FAIL
} from '../../actions/triage-actions/postInjectionsSlice';


const initialState = {
    postInjectionsLoading: false,
    postInjections: [],
    error: null,
};

export const postInjectionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_INJECTIONS_REQUEST:
            return {
                ...state,
                postInjectionsLoading: true,
                error: null,
            };
        case POST_INJECTIONS_SUCCESS:
            return {
                ...state,
                postInjectionsLoading: false,
                postInjections: action.payload,
                error: null,
            };
        case POST_INJECTIONS_FAIL:
            return {
                ...state,
                postInjectionsLoading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};