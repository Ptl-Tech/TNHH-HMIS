import {
    POST_INITIATE_DISCHARGE_REQUEST,
    POST_INITIATE_DISCHARGE_SUCCESS,
    POST_INITIATE_DISCHARGE_FAILURE,
} from "../../actions/nurse-actions/postInitiateDischargeSlice";

const initialState = {
    loadingInitiateDischarge: false,
    postInitiateDischarge: [],
    error: '',
};

export const postInitiateDischargeReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_INITIATE_DISCHARGE_REQUEST:
            return { ...state, loadingInitiateDischarge: true };
        case POST_INITIATE_DISCHARGE_SUCCESS:
            return { ...state, loadingInitiateDischarge: false, postInitiateDischarge: action.payload };
        case POST_INITIATE_DISCHARGE_FAILURE:
            return { ...state, loadingInitiateDischarge: false, error: action.payload };
        default:
            return state;
    }
};