import {
    GET_QY_IP_LOOKUP_VALUES_REQUEST,
    GET_QY_IP_LOOKUP_VALUES_SUCCESS,
    GET_QY_IP_LOOKUP_VALUES_FAILURE,
} from "../../actions/nurse-actions/getQyIPLookupValuesSlice";

const initialState = {
    loadingIpLookupValues: false,
    ipLookupValues: [],
    error: '',
};

export const getQyIpLookupValuesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_QY_IP_LOOKUP_VALUES_REQUEST:
            return { ...state, loadingIpLookupValues: true };
        case GET_QY_IP_LOOKUP_VALUES_SUCCESS:
            return { ...state, loadingIpLookupValues: false, ipLookupValues: action.payload };
        case GET_QY_IP_LOOKUP_VALUES_FAILURE:
            return { ...state, loadingIpLookupValues: false, error: action.payload };
        default:
            return state;
    }
};