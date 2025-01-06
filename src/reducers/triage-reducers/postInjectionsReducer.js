
import {

    POST_INJECTIONS_REQUEST,
    POST_INJECTIONS_SUCCESS,
    POST_INJECTIONS_FAIL
} from '../../actions/triage-actions/postInjectionsSlice';


const initialState = {
    saveInjectionsLoading: false,
    saveInjections: [],
    error: null,
};

export const postInjectionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_INJECTIONS_REQUEST:
            console.log('postInjectionsReducer request', action.payload)
            return {
                ...state,
                saveInjectionsLoading: true,
                error: null,
            };
        case POST_INJECTIONS_SUCCESS:
            console.log('postInjectionsReducer success', action.payload)
            return {
                ...state,
                saveInjectionsLoading: false,
                saveInjections: action.payload,
                error: null,
            };
        case POST_INJECTIONS_FAIL:
            console.log('postInjectionsReducer fail', action.payload)
            return {
                ...state,
                saveInjectionsLoading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};