import {
    POST_PATIENT_ADMISSION_REQUEST,
    POST_PATIENT_ADMISSION_SUCCESS,
    POST_PATIENT_ADMISSION_FAILURE,
} from "../../actions/nurse-actions/postPatientAdmissionSlice";

const initialState = {
    loadingAdmission: false,
    admissions: [],
    error: '',
};

export const postPatientAdmissionReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_PATIENT_ADMISSION_REQUEST:
            return { ...state, loadingAdmission: true };
        case POST_PATIENT_ADMISSION_SUCCESS:
            return { ...state, loadingAdmission: false, admissions: action.payload };
        case POST_PATIENT_ADMISSION_FAILURE:
            return { ...state, loadingAdmission: false, error: action.payload };
        default:
            return state;
    }
};