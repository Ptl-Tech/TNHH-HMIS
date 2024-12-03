import {
    GET_STORE_REQUISITION_HEADERS_REQUEST,
    GET_STORE_REQUISITION_HEADERS_SUCCESS,
    GET_STORE_REQUISITION_HEADERS_FAILURE,
} from "../../actions/triage-actions/getStoreRequisitionHeadersSlice";

const initialState = {
    loadingRequisitionHeaders: false,
    requisitionHeaders: [],
    error: '',
};

export const getStoreRequisitionHeadersReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_STORE_REQUISITION_HEADERS_REQUEST:
            return { ...state, loadingRequisitionHeaders: true };
        case GET_STORE_REQUISITION_HEADERS_SUCCESS:
            return { ...state, loadingRequisitionHeaders: false, requisitionHeaders: action.payload };
        case GET_STORE_REQUISITION_HEADERS_FAILURE:
            return { ...state, loadingRequisitionHeaders: false, triageList: action.payload };
        default:
            return state;
    }
};