


import {

    UPDATE_TRIAGE_LIST_VITALS_REQUEST,
    UPDATE_TRIAGE_LIST_VITALS_SUCCESS,
    UPDATE_TRIAGE_LIST_VITALS_FAIL
} from '../../actions/triage-actions/updateTriageListVitalsSlice';


const initialState = {
    loadingUpdateVitals: false,
    updateVitals: [],
    error: null,
};

export const updateTriageListVitalsReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_TRIAGE_LIST_VITALS_REQUEST:
            return {
                ...state,
                loadingUpdateVitals: true,
                error: null,
            };
        case UPDATE_TRIAGE_LIST_VITALS_SUCCESS:
            return {
                ...state,
                loadingUpdateVitals: false,
                updateVitals: action.payload,
                error: null,
            };
        case UPDATE_TRIAGE_LIST_VITALS_FAIL:
            return {
                ...state,
                loadingUpdateVitals: false,
                error: action.payload,
            };
        default:
            return state;
    }
};