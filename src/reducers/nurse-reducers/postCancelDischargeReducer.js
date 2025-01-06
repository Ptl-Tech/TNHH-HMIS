import {
    POST_CANCEL_DISCHARGE_REQUEST,
    POST_CANCEL_DISCHARGE_SUCCESS,
    POST_CANCEL_DISCHARGE_FAILURE,
} from "../../actions/nurse-actions/postCancelDischargeSlice";

const initialState = {
    loadingPostCancelDischarge: false,
    postCancelDischarge: [],
    error: '',
};

export const postCancelDischargeReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_CANCEL_DISCHARGE_REQUEST:
            return { ...state, loadingPostCancelDischarge: true };
        case POST_CANCEL_DISCHARGE_SUCCESS:
            return { ...state, loadingPostCancelDischarge: false, postCancelDischarge: action.payload };
        case POST_CANCEL_DISCHARGE_FAILURE:
            return { ...state, loadingPostCancelDischarge: false, error: action.payload };
        default:
            return state;
    }
};