import {
    GET_PG_WARDS_LIST_REQUEST,
    GET_PG_WARDS_LIST_SUCCESS,
    GET_PG_WARDS_LIST_FAILURE,
} from "../../actions/nurse-actions/getPgWardsListSlice";

const initialState = {
    loadingWards: false,
    getWards: [],
    error: '',
};

export const getPgWardsListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PG_WARDS_LIST_REQUEST:
            return { ...state, loadingWards: true };
        case GET_PG_WARDS_LIST_SUCCESS:
            return { ...state, loadingWards: false, getWards: action.payload };
        case GET_PG_WARDS_LIST_FAILURE:
            return { ...state, loadingWards: false, error: action.payload };
        default:
            return state;
    }
};


