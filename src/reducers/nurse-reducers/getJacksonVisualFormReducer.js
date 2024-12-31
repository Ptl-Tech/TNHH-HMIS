import {
    GET_JACKSON_VISUAL_FORM_REQUEST,
    GET_JACKSON_VISUAL_FORM_SUCCESS,
    GET_JACKSON_VISUAL_FORM_FAILURE,
} from "../../actions/nurse-actions/getJacksonVisualFormSlice";

const initialState = {
    loadingGetJacksonVisual: false,
    getJacksonVisual: [],
    error: '',
};

export const getJacksonVisualFormReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_JACKSON_VISUAL_FORM_REQUEST:
            return { ...state, loadingGetJacksonVisual: true };
        case GET_JACKSON_VISUAL_FORM_SUCCESS:
            return { ...state, loadingGetJacksonVisual: false, getJacksonVisual: action.payload };
        case GET_JACKSON_VISUAL_FORM_FAILURE:
            return { ...state, loadingGetJacksonVisual: false, error: action.payload };
        default:
            return state;
    }
};