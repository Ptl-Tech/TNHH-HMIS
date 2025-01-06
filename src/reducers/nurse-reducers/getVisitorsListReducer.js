import {
    GET_VISITORS_LIST_REQUEST,
    GET_VISITORS_LIST_SUCCESS,
    GET_VISITORS_LIST_FAILURE,
} from "../../actions/nurse-actions/getVisitorsListSlice";

const initialState = {
    loadingIpVisitors: false,
    ipVisitors: [],
    error: '',
};

export const getVisitorsListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_VISITORS_LIST_REQUEST:
            return { ...state, loadingIpVisitors: true };
        case GET_VISITORS_LIST_SUCCESS:
            return { ...state, loadingIpVisitors: false, ipVisitors: action.payload };
        case GET_VISITORS_LIST_FAILURE:
            return { ...state, loadingIpVisitors: false, error: action.payload };
        default:
            return state;
    }
};