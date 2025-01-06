import {
    GET_ADMISSIONS_VERIFIED_REQUEST,
    GET_ADMISSIONS_VERIFIED_SUCCESS,
    GET_ADMISSIONS_VERIFIED_FAILURE,
} from "../../actions/nurse-actions/getPgAdmissionsVerifiedSlice";

const initialState = {
    loadingGetPatientAdmissions: false,
    getPatientAdmissions: [],
    error: '',
};

export const getPgAdmissionsVerifiedReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ADMISSIONS_VERIFIED_REQUEST:
            return { ...state, loadingGetPatientAdmissions: true };
        case GET_ADMISSIONS_VERIFIED_SUCCESS:
            return { ...state, loadingGetPatientAdmissions: false, getPatientAdmissions: action.payload };
        case GET_ADMISSIONS_VERIFIED_FAILURE:
            return { ...state, loadingGetPatientAdmissions: false, error: action.payload };
        default:
            return state;
    }
};