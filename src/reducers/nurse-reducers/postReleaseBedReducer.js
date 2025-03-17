import {
    POST_RELEASE_BED_REQUEST,
    POST_RELEASE_BED_SUCCESS,
    POST_RELEASE_BED_FAILURE,
    POST_BED_TRANSFER_LINE_REQUEST,
    POST_BED_TRANSFER_LINE_SUCCESS,
    POST_BED_TRANSFER_LINE_FAILURE,
    POST_SAVE_BED_TRANSFER_LINE_REQUEST,
    POST_SAVE_BED_TRANSFER_LINE_SUCCESS,
    POST_SAVE_BED_TRANSFER_LINE_FAILURE,
    GET_QY_BED_TRANSFER_LINES_REQUEST,
    GET_QY_BED_TRANSFER_LINES_SUCCESS,
    GET_QY_BED_TRANSFER_LINES_FAILURE
} from "../../actions/nurse-actions/postReleaseBedSlice";

const initialState = {
    loadingPostReleaseBed: false,
    postReleaseBed: [],
    error: '',
};

const initialBedState = {
    loading: false,
    data: [],
    error: '',
};

export const postReleaseBedReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_RELEASE_BED_REQUEST:
            return { ...state, loadingPostReleaseBed: true };
        case POST_RELEASE_BED_SUCCESS:
            return { ...state, loadingPostReleaseBed: false, postReleaseBed: action.payload };
        case POST_RELEASE_BED_FAILURE:
            return { ...state, loadingPostReleaseBed: false, error: action.payload };
        default:
            return state;
    }
};

export const postBedTransferLineReducer = (state = initialBedState, action) => {
    switch (action.type) {
        case POST_BED_TRANSFER_LINE_REQUEST:
            return { ...state, loading: true };
        case POST_BED_TRANSFER_LINE_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case POST_BED_TRANSFER_LINE_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export const postSaveBedTransferLineReducer = (state = initialBedState, action) => {
    switch (action.type) {
        case POST_SAVE_BED_TRANSFER_LINE_REQUEST:
            return { ...state, loading: true };
        case POST_SAVE_BED_TRANSFER_LINE_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case POST_SAVE_BED_TRANSFER_LINE_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export const getQyBedTransferLineReducer = (state = initialBedState, action) => {
    switch (action.type) {
        case GET_QY_BED_TRANSFER_LINES_REQUEST:
            return { ...state, loading: true };
        case GET_QY_BED_TRANSFER_LINES_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case GET_QY_BED_TRANSFER_LINES_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};