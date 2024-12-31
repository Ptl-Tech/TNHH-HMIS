import {
    GET_QY_IP_DIETARY_FORM_REQUEST,
    GET_QY_IP_DIETARY_FORM_SUCCESS,
    GET_QY_IP_DIETARY_FORM_FAILURE,
} from "../../actions/nurse-actions/getQyIPDietaryFormLinesSlice";

const initialState = {
    loadingGetIpDietaryForm: false,
    ipGetDietaryForm: [],
    error: '',
};

export const getQyDietaryFormLineReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_QY_IP_DIETARY_FORM_REQUEST:
            return { ...state, loadingGetIpDietaryForm: true };
        case GET_QY_IP_DIETARY_FORM_SUCCESS:
            return { ...state, loadingGetIpDietaryForm: false, ipGetDietaryForm: action.payload };
        case GET_QY_IP_DIETARY_FORM_FAILURE:
            return { ...state, loadingGetIpDietaryForm: false, error: action.payload };
        default:
            return state;
    }
};