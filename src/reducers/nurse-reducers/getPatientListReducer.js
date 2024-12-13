import {
    GET_PATIENT_LIST_REQUEST,
    GET_PATIENT_LIST_SUCCESS,
    GET_PATIENT_LIST_FAILURE,
} from "../../actions/nurse-actions/getPatientListSlice";

const initialState = {
    loadingPatientList: false,
    allPatientLList: [],
    error: '',
};

export const getPatientListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PATIENT_LIST_REQUEST:
            return { ...state, loadingPatientList: true };
        case GET_PATIENT_LIST_SUCCESS:
            return { ...state, loadingPatientList: false, allPatientLList: action.payload };
        case GET_PATIENT_LIST_FAILURE:
            return { ...state, loadingPatientList: false, error: action.payload };
        default:
            return state;
    }
};