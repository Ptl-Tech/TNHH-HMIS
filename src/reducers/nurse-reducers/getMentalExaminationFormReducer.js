import {
    GET_MENTAL_EXAMINATION_FORM_REQUEST,
    GET_MENTAL_EXAMINATION_FORM_SUCCESS,
    GET_MENTAL_EXAMINATION_FORM_FAILURE,
} from "../../actions/nurse-actions/getMentalExaminationFormSlice";

const initialState = {
    loadingIpGetMentalStatusForm: false,
    ipGetMentalStatusForm: [],
    error: '',
};

export const getMentalExaminationFormReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_MENTAL_EXAMINATION_FORM_REQUEST:
            return { ...state, loadingIpGetMentalStatusForm: true };
        case GET_MENTAL_EXAMINATION_FORM_SUCCESS:
            return { ...state, loadingIpGetMentalStatusForm: false, ipGetMentalStatusForm: action.payload };
        case GET_MENTAL_EXAMINATION_FORM_FAILURE:
            return { ...state, loadingIpGetMentalStatusForm: false, error: action.payload };
        default:
            return state;
    }
};