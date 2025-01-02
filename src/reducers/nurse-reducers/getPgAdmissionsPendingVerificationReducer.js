import {
    GET_PG_ADMISSIONS_PENDING_VERIFICATION_REQUEST,
    GET_PG_ADMISSIONS_PENDING_VERIFICATION_SUCCESS,
    GET_PG_ADMISSIONS_PENDING_VERIFICATION_FAILURE,
} from "../../actions/nurse-actions/getPgAdmissionsPendingVerificationSlice";

const initialState = {
    loadingPendingAdmissionVerification: false,
    pendingAdmissionVerification: [],
    error: '',
};

export const getPgAdmissionPendingVerificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PG_ADMISSIONS_PENDING_VERIFICATION_REQUEST:
            return { ...state, loadingPendingAdmissionVerification: true };
        case GET_PG_ADMISSIONS_PENDING_VERIFICATION_SUCCESS:
            return { ...state, loadingPendingAdmissionVerification: false, pendingAdmissionVerification: action.payload };
        case GET_PG_ADMISSIONS_PENDING_VERIFICATION_FAILURE:
            return { ...state, loadingPendingAdmissionVerification: false, error: action.payload };
        default:
            return state;
    }
};