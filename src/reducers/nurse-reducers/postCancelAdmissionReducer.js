import {
    POST_CANCEL_ADMISSION_REQUEST,
    POST_CANCEL_ADMISSION_SUCCESS,
    POST_CANCEL_ADMISSION_FAILURE,
} from "../../actions/nurse-actions/postCancelAdmissionSlice";

const initialState = {
    loadingCancelAdmission: false,
    verifyCancelAdmission: [],
    error: '',
};

export const postCancelAdmissionReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_CANCEL_ADMISSION_REQUEST:
            return { ...state, loadingCancelAdmission: true };
        case POST_CANCEL_ADMISSION_SUCCESS:
            return { ...state, loadingCancelAdmission: false, verifyCancelAdmission: action.payload };
        case POST_CANCEL_ADMISSION_FAILURE:
            return { ...state, loadingCancelAdmission: false, error: action.payload };
        default:
            return state;
    }
};