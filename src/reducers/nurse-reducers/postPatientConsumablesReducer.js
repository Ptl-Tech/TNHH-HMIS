import {
    POST_PATIENT_CONSUMABLES_REQUEST,
    POST_PATIENT_CONSUMABLES_SUCCESS,
    POST_PATIENT_CONSUMABLES_FAILURE,
} from "../../actions/nurse-actions/postPatientConsumablesSlice";

const initialState = {
    loadingPostConsumables: false,
    postConsumables: [],
    error: '',
};

export const postPatientConsumablesReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_PATIENT_CONSUMABLES_REQUEST:
            return { ...state, loadingPostConsumables: true };
        case POST_PATIENT_CONSUMABLES_SUCCESS:
            return { ...state, loadingPostConsumables: false, postConsumables: action.payload };
        case POST_PATIENT_CONSUMABLES_FAILURE:
            return { ...state, loadingPostConsumables: false, error: action.payload };
        default:
            return state;
    }
};