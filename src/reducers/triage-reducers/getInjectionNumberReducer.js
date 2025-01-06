import {
    GET_INJECTIONS_NUMBER_REQUEST,
    GET_INJECTIONS_NUMBER_SUCCESS,
    GET_INJECTIONS_NUMBER_FAILURE,
} from "../../actions/triage-actions/getInjectionNumberSlice";

const initialState = {
    loadingInjectionNumber: false,
    injectionsNumber: [],
    error: '',
};

export const getInjectionNumberReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_INJECTIONS_NUMBER_REQUEST:
            return { ...state, loadingInjectionNumber: true };
        case GET_INJECTIONS_NUMBER_SUCCESS:
            return { ...state, loadingInjectionNumber: false, injectionsNumber: action.payload };
        case GET_INJECTIONS_NUMBER_FAILURE:
            return { ...state, loadingInjectionNumber: false, error: action.payload };
        default:
            return state;
    }
};