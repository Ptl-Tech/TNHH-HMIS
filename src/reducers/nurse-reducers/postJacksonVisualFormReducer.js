import {
    POST_JACKSON_VISUAL_FORM_REQUEST,
    POST_JACKSON_VISUAL_FORM_SUCCESS,
    POST_JACKSON_VISUAL_FORM_FAILURE,
} from "../../actions/nurse-actions/postJacksonVisualFormSlice";

const initialState = {
    loadingJackson: false,
    jackson: [],
    error: '',
};

export const postJacksonVisualFormReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_JACKSON_VISUAL_FORM_REQUEST:
            return { ...state, loadingJackson: true };
        case POST_JACKSON_VISUAL_FORM_SUCCESS:
            return { ...state, loadingJackson: false, jackson: action.payload };
        case POST_JACKSON_VISUAL_FORM_FAILURE:
            return { ...state, loadingJackson: false, error: action.payload };
        default:
            return state;
    }
};