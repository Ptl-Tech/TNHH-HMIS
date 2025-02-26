import {
    GET_PG_BEDS_REQUEST,
    GET_PG_BEDS_SUCCESS,
    GET_PG_BEDS_FAILURE,
    GET_PG_BED_DETAILS_REQUEST,
    GET_PG_BED_DETAILS_SUCCESS,
    GET_PG_BED_DETAILS_FAILURE,
} from "../../actions/nurse-actions/getPgBedsSlice";

const initialState = {
    loadingBeds: false,
    getBeds: [],
    error: '',
};

const initialBedDetailsState = {
    loading: false,
    data: [],
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

export const getPgBedsDetailsReducer = (state = initialBedDetailsState, action) => {
    switch (action.type) {
        case GET_PG_BED_DETAILS_REQUEST:
            return { ...state, loading: true };
        case GET_PG_BED_DETAILS_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case GET_PG_BED_DETAILS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};
