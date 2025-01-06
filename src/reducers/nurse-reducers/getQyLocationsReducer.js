import {
    GET_QY_LOCATION_REQUEST,
    GET_QY_LOCATION_SUCCESS,
    GET_QY_LOCATION_FAILURE,
} from "../../actions/nurse-actions/getQyLocationsSlice";

const initialState = {
    loadingQyLocations: false,
    qyLocations: [],
    error: '',
};

export const getQyLocationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_QY_LOCATION_REQUEST:
            return { ...state, loadingQyLocations: true };
        case GET_QY_LOCATION_SUCCESS:
            return { ...state, loadingQyLocations: false, qyLocations: action.payload };
        case GET_QY_LOCATION_FAILURE:
            return { ...state, loadingQyLocations: false, error: action.payload };
        default:
            return state;
    }
};