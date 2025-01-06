import {
    GET_INPATIENT_INJECTION_REQUEST,
    GET_INPATIENT_INJECTION_SUCCESS,
    GET_INPATIENT_INJECTION_FAILURE,
} from "../../actions/nurse-actions/getInpatientInjectionSlice";

const initialState = {
    loadingGetInpatientInjection: false,
    injections: [],
    error: '',
};

export const getInpatientInjectionReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_INPATIENT_INJECTION_REQUEST:
            return { ...state, loadingGetInpatientInjection: true };
        case GET_INPATIENT_INJECTION_SUCCESS:
            return { ...state, loadingGetInpatientInjection: false, injections: action.payload };
        case GET_INPATIENT_INJECTION_FAILURE:
            return { ...state, loadingGetInpatientInjection: false, error: action.payload };
        default:
            return state;
    }
};