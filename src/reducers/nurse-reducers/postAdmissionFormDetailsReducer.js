import {
    POST_ADMISSION_FORM_DETAILS_REQUEST,
    POST_ADMISSION_FORM_DETAILS_SUCCESS,
    POST_ADMISSION_FORM_DETAILS_FAILURE,
} from "../../actions/nurse-actions/postAdmissionFormDetailsSlice";

const initialState = {
    loadingAdmissionDetails: false,
    postAdmissionDetails: [],
    error: '',
};

export const postAdmissionFormDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_ADMISSION_FORM_DETAILS_REQUEST:
            return { ...state, loadingAdmissionDetails: true };
        case POST_ADMISSION_FORM_DETAILS_SUCCESS:
            return { ...state, loadingAdmissionDetails: false, postAdmissionDetails: action.payload };
        case POST_ADMISSION_FORM_DETAILS_FAILURE:
            return { ...state, loadingAdmissionDetails: false, error: action.payload };
        default:
            return state;
    }
};