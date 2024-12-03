import {
    GET_ITEMS_UNITS_OF_MEASURE_REQUEST,
    GET_ITEMS_UNITS_OF_MEASURE_SUCCESS,
    GET_ITEMS_UNITS_OF_MEASURE_FAILURE,
} from "../../actions/triage-actions/getItemUnitsOfMeasureSlice";

const initialState = {
    loadingItemUnitsOfMeasure: false,
    itemUnitsOfMeasure: [],
    error: '',
};

export const getItemUnitsOfMeasureReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ITEMS_UNITS_OF_MEASURE_REQUEST:
            return { ...state, loadingItemUnitsOfMeasure: true };
        case GET_ITEMS_UNITS_OF_MEASURE_SUCCESS:
            return { ...state, loadingItemUnitsOfMeasure: false, itemUnitsOfMeasure: action.payload };
        case GET_ITEMS_UNITS_OF_MEASURE_FAILURE:
            return { ...state,loadingItemUnitsOfMeasures: false, error: action.payload };
        default:
            return state;
    }
};