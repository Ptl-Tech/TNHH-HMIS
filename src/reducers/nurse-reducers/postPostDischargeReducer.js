import {
    POST_DISCHARGE_PATIENT_REQUEST,
    POST_DISCHARGE_PATIENT_SUCCESS,
    POST_DISCHARGE_PATIENT_FAILURE,
} from "../../actions/nurse-actions/postPostDischargeSlice";

const initialState = {
    loadingPostDischarge: false,
    postDischarge: [],
    error: '',
};

export const postPostDischargeReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_DISCHARGE_PATIENT_REQUEST:
            return { ...state, loadingPostDischarge: true };
        case POST_DISCHARGE_PATIENT_SUCCESS:
            return { ...state, loadingPostDischarge: false, postDischarge: action.payload };
        case POST_DISCHARGE_PATIENT_FAILURE:
            return { ...state, loadingPostDischarge: false, error: action.payload };
        default:
            return state;
    }
};