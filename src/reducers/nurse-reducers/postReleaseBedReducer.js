import {
    POST_RELEASE_BED_REQUEST,
    POST_RELEASE_BED_SUCCESS,
    POST_RELEASE_BED_FAILURE,
} from "../../actions/nurse-actions/postReleaseBedSlice";

const initialState = {
    loadingPostReleaseBed: false,
    postReleaseBed: [],
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