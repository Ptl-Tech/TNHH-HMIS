
import {

    POST_TRIAGE_LIST_VITALS_REQUEST,
    POST_TRIAGE_LIST_VITALS_SUCCESS,
    POST_TRIAGE_LIST_VITALS_FAIL
} from '../../actions/triage-actions/postTriageListVitalsSlice';


const initialState = {
    loading: false,
    vitals: [],
    error: null,
};

export const postTriageListVitalsReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_TRIAGE_LIST_VITALS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case POST_TRIAGE_LIST_VITALS_SUCCESS:
            return {
                ...state,
                loading: false,
                vitals: action.payload,
                error: null,
            };
        case POST_TRIAGE_LIST_VITALS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};