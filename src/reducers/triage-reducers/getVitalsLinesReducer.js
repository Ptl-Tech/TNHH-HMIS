import {
    GET_VITAL_LINES_FAILURE,
    GET_VITAL_LINES_REQUEST,
    GET_VITAL_LINES_SUCCESS,
} from "../../actions/triage-actions/getVitalsLinesSlice";

const initialState = {
    loadingVitalsLines: false,
    vitalsLines: [],
    error: '',
};

export const getVitalsLinesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_VITAL_LINES_REQUEST:
            return { ...state, loadingVitalsLines: true };
        case GET_VITAL_LINES_SUCCESS:
            return { ...state, loadingVitalsLines: false, vitalsLines: action.payload };
        case GET_VITAL_LINES_FAILURE:
            return { ...state, loadingVitalsLines: false, vitalsLines: action.payload };
        default:
            return state;
    }
};