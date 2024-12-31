import {
    POST_MENTAL_EXAMINATION_FORM_REQUEST,
    POST_MENTAL_EXAMINATION_FORM_SUCCESS,
    POST_MENTAL_EXAMINATION_FORM_FAILURE,
} from "../../actions/nurse-actions/postMentalExaminationFormSlice";

const initialState = {
    loadingMentalStatus: false,
    mentalStatus: [],
    error: '',
};

export const postMentalExaminationFormReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_MENTAL_EXAMINATION_FORM_REQUEST:
            return { ...state, loadingMentalStatus: true };
        case POST_MENTAL_EXAMINATION_FORM_SUCCESS:
            return { ...state, loadingMentalStatus: false, mentalStatus: action.payload };
        case POST_MENTAL_EXAMINATION_FORM_FAILURE:
            return { ...state, loadingMentalStatus: false, error: action.payload };
        default:
            return state;
    }
};