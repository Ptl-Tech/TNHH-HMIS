import {
    POST_SUICIDAL_FORM_REQUEST,
    POST_SUICIDAL_FORM_SUCCESS,
    POST_SUICIDAL_FORM_FAILURE,
} from "../../actions/nurse-actions/postSuicidalFormSlice";

const initialState = {
    loadingSuicidalForm: false,
    suicidalForm: [],
    error: '',
};

export const postSuicidalFormReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_SUICIDAL_FORM_REQUEST:
            return { ...state, loadingSuicidalForm: true };
        case POST_SUICIDAL_FORM_SUCCESS:
            return { ...state, loadingSuicidalForm: false, suicidalForm: action.payload };
        case POST_SUICIDAL_FORM_FAILURE:
            return { ...state, loadingSuicidalForm: false, error: action.payload };
        default:
            return state;
    }
};