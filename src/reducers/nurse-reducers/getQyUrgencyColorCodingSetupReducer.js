import {
    GET_QY_URGENCY_COLOR_CODING_REQUEST,
    GET_QY_URGENCY_COLOR_CODING_SUCCESS,
    GET_QY_URGENCY_COLOR_CODING_FAILURE,
} from "../../actions/nurse-actions/getQyUrgencyColorCodingSetupSlice";

const initialState = {
    loadingColorCode: false,
    colorCode: [],
    error: '',
};

export const getQyUrgencyColorCodingSetupReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_QY_URGENCY_COLOR_CODING_REQUEST:
            return { ...state, loadingColorCode: true };
        case GET_QY_URGENCY_COLOR_CODING_SUCCESS:
            return { ...state, loadingColorCode: false, colorCode: action.payload };
        case GET_QY_URGENCY_COLOR_CODING_FAILURE:
            return { ...state, loadingColorCode: false, error: action.payload };
        default:
            return state;
    }
};