import { POST_NURSE_ORDER_SHEET_FAILURE, POST_NURSE_ORDER_SHEET_REQUEST, POST_NURSE_ORDER_SHEET_SUCCESS } from "../../actions/nurse-actions/postNurseOrderSheet";


const initialState = {
    loadingpostNurseOrderSheet: false,
    postOrderSheet: [],
    error: '',
};

export const postNurseOrderSheetReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_NURSE_ORDER_SHEET_REQUEST:
            return { ...state, loadingpostNurseOrderSheet: true };
        case POST_NURSE_ORDER_SHEET_SUCCESS:
            return { ...state, loadingpostNurseOrderSheet: false, postOrderSheet: action.payload };
        case POST_NURSE_ORDER_SHEET_FAILURE:
            return { ...state, loadingpostNurseOrderSheet: false, error: action.payload };
        default:
            return state;
    }
};