import {
    GET_PG_ADMISSIONS_ADMITTED_REQUEST,
    GET_PG_ADMISSIONS_ADMITTED_SUCCESS,
    GET_PG_ADMISSIONS_ADMITTED_FAILURE,
} from "../../actions/nurse-actions/getPgAdmissionsAdmittedSlice";

const initialState = {
    loadingAdmittedPatients: false,
    admittedPatients: [],
    error: '',
};

export const getAdmissionsAdmittedReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PG_ADMISSIONS_ADMITTED_REQUEST:
            return { ...state, loadingAdmittedPatients: true };
        case GET_PG_ADMISSIONS_ADMITTED_SUCCESS:
            return { ...state, loadingAdmittedPatients: false, admittedPatients: action.payload };
        case GET_PG_ADMISSIONS_ADMITTED_FAILURE:
            return { ...state, loadingAdmittedPatients: false, error: action.payload };
        default:
            return state;
    }
};