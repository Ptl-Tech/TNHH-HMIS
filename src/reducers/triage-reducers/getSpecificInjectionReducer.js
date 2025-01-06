
import {

    GET_SPECIFIC_INJECTION_REQUEST,
    GET_SPECIFIC_INJECTION_SUCCESS,
    GET_SPECIFIC_INJECTION_FAILURE
} from '../../actions/triage-actions/getSpecificInjectionSlice';


const initialState = {
    loadingInjection: false,
    injections: [],
    error: null,
};

export const getSpecificInjectionReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPECIFIC_INJECTION_REQUEST:
            return {
                ...state,
                loadingInjection: true,
                error: null,
            };
        case GET_SPECIFIC_INJECTION_SUCCESS:
            return {
                ...state,
                loadingInjection: false,
                injections: action.payload,
                error: null,
            };
        case GET_SPECIFIC_INJECTION_FAILURE:
            return {
                ...state,
                loadingInjection: false,
                error: action.payload,
            };
        default:
            return state;
    }
};