import {
    POST_VISITOR_LIST_REQUEST,
    POST_VISITOR_LIST_SUCCESS,
    POST_VISITOR_LIST_FAILURE,
} from "../../actions/nurse-actions/postVisitorListSlice";

const initialState = {
    loadingVisitor: false,
    postVisitor: [],
    error: '',
};

export const postVisitorListReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_VISITOR_LIST_REQUEST:
            return { ...state, loadingVisitor: true };
        case POST_VISITOR_LIST_SUCCESS:
            return { ...state, loadingVisitor: false, postVisitor: action.payload };
        case POST_VISITOR_LIST_FAILURE:
            return { ...state, loadingVisitor: false, error: action.payload };
        default:
            return state;
    }
};