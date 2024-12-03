import {
    GET_ITEMS_REQUEST,
    GET_ITEMS_SUCCESS,
    GET_ITEMS_FAILURE,
} from "../../actions/triage-actions/getItemsSlice";

const initialState = {
    loadingItems: false,
    items: [],
    error: '',
};

export const getItemsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ITEMS_REQUEST:
            return { ...state, loadingItems: true };
        case GET_ITEMS_SUCCESS:
            return { ...state, loadingItems: false, items: action.payload };
        case GET_ITEMS_FAILURE:
            return { ...state, loadingItems: false, error: action.payload };
        default:
            return state;
    }
};