
import {
    GET_QY_PRESCRIPTION_LINE_REQUEST,
    GET_QY_PRESCRIPTION_LINE_SUCCESS,
    GET_QY_PRESCRIPTION_LINE_FAILURE,
    GET_INPATIENT_QY_PRESCRIPTION_LINE_REQUEST,
    GET_INPATIENT_QY_PRESCRIPTION_LINE_SUCCESS,
    GET_INPATIENT_QY_PRESCRIPTION_LINE_FAILURE
} from "../../actions/Doc-actions/QyPrescriptionLinesSlice";

const initialState = {
    loadingPrescriptions: false,
    prescriptions: [],
    error: '',
};

const initialPrescriptionState = {
    loading: false,
    data: [],
    error: '',
};

export const getQyPrescriptionLinesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_QY_PRESCRIPTION_LINE_REQUEST:
            return { ...state, loadingPrescriptions: true };
        case GET_QY_PRESCRIPTION_LINE_SUCCESS:
            return { ...state, loadingPrescriptions: false, prescriptions: action.payload };
        case GET_QY_PRESCRIPTION_LINE_FAILURE:
            return { ...state, loadingPrescriptions: false, error: action.payload };
        default:
            return state;
    }
};

export const getInPatientQyPrescriptionLines = (state = initialPrescriptionState, action) => {
    switch (action.type) {
        case GET_INPATIENT_QY_PRESCRIPTION_LINE_REQUEST:
            return { ...state, loading: true };
        case GET_INPATIENT_QY_PRESCRIPTION_LINE_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case GET_INPATIENT_QY_PRESCRIPTION_LINE_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};