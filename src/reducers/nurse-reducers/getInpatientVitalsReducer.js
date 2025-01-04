import {
    GET_INPATIENT_VITALS_REQUEST,
    GET_INPATIENT_VITALS_SUCCESS,
    GET_INPATIENT_VITALS_FAILURE,
} from "../../actions/nurse-actions/getInpatientVitalsSlice";

const initialState = {
    loadingInpatientVitals: false,
    inpatientVitals: [],
    error: '',
};

export const getInpatientVitalsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_INPATIENT_VITALS_REQUEST:
            return { ...state, loadingInpatientVitals: true };
        case GET_INPATIENT_VITALS_SUCCESS:
            return { ...state, loadingInpatientVitals: false, inpatientVitals: action.payload };
        case GET_INPATIENT_VITALS_FAILURE:
            return { ...state, loadingInpatientVitals: false, error: action.payload };
        default:
            return state;
    }
};