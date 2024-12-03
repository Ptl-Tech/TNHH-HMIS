
import {

    POST_DRESSINGS_REQUEST,
    POST_DRESSINGS_SUCCESS,
    POST_DRESSINGS_FAIL
} from '../../actions/triage-actions/postDressingsSlice';


const initialState = {
    dressingsLoading: false,
    dressings: [],
    error: null,
};

export const postDressingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_DRESSINGS_REQUEST:
            return {
                ...state,
                dressingsLoading: true,
                error: null,
            };
        case POST_DRESSINGS_SUCCESS:
            return {
                ...state,
                dressingsLoading: false,
                dressings: action.payload,
                error: null,
            };
        case POST_DRESSINGS_FAIL:
            return {
                ...state,
                dressingsLoading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};