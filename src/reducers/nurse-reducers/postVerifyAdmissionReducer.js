import {
    POST_VERIFY_ADMISSION_REQUEST,
    POST_VERIFY_ADMISSION_SUCCESS,
    POST_VERIFY_ADMISSION_FAILURE,
} from "../../actions/nurse-actions/postVerifyAdmissionSlice";

const initialState = {
    loadingVerifyAdmission: false,
    verifyAdmission: [],
    error: '',
};

export const postVerifyAdmissionReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_VERIFY_ADMISSION_REQUEST:
            return { ...state, loadingVerifyAdmission: true };
        case POST_VERIFY_ADMISSION_SUCCESS:
            return { ...state, loadingVerifyAdmission: false, verifyAdmission: action.payload };
        case POST_VERIFY_ADMISSION_FAILURE:
            return { ...state, loadingVerifyAdmission: false, error: action.payload };
        default:
            return state;
    }
};