import {
    GET_PG_BEDS_REQUEST,
    GET_PG_BEDS_SUCCESS,
    GET_PG_BEDS_FAILURE,
} from "../../actions/nurse-actions/getPgBedsSlice";

const initialState = {
    loadingBeds: false,
    getBeds: [],
    error: '',
};

export const getPgBedsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PG_BEDS_REQUEST:
            return { ...state, loadingBeds: true };
        case GET_PG_BEDS_SUCCESS:
            return { ...state, loadingBeds: false, getBeds: action.payload };
        case GET_PG_BEDS_FAILURE:
            return { ...state, loadingBeds: false, error: action.payload };
        default:
            return state;
    }
};