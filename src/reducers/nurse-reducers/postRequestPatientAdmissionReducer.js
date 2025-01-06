import {
    POST_REQUEST_PATIENT_ADMISSION_REQUEST,
    POST_REQUEST_PATIENT_ADMISSION_SUCCESS ,
    POST_REQUEST_PATIENT_ADMISSION_FAILURE,
} from "../../actions/nurse-actions/postRequestPatientAdmissionSlice";

const initialState = {
    loadingRequestAdmission: false,
    admissionsRequest: [],
    error: '',
};

export const postRequestPatientAdmissionReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_REQUEST_PATIENT_ADMISSION_REQUEST:
            return { ...state, loadingRequestAdmission: true };
        case POST_REQUEST_PATIENT_ADMISSION_SUCCESS :
            return { ...state, loadingRequestAdmission: false, admissionsRequest: action.payload };
        case POST_REQUEST_PATIENT_ADMISSION_FAILURE:
            return { ...state, loadingRequestAdmission: false, error: action.payload };
        default:
            return state;
    }
};