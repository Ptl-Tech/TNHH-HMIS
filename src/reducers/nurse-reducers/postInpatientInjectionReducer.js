import {
    POST_INPATIENT_INJECTION_REQUEST,
    POST_INPATIENT_INJECTION_SUCCESS,
    POST_INPATIENT_INJECTION_FAILURE,
} from "../../actions/nurse-actions/postInpatientInjectionSlice";

const initialState = {
    loadingInpatientInjection: false,
    inpatientInjection: [],
    error: '',
};

export const postInpatientInjectionReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_INPATIENT_INJECTION_REQUEST:
            return { ...state, loadingInpatientInjection: true };
        case POST_INPATIENT_INJECTION_SUCCESS:
            return { ...state, loadingInpatientInjection: false, inpatientInjection: action.payload };
        case POST_INPATIENT_INJECTION_FAILURE:
            return { ...state, loadingInpatientInjection: false, error: action.payload };
        default:
            return state;
    }
};