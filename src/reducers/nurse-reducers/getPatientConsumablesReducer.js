import {
    GET_PATIENT_CONSUMABLES_REQUEST,
    GET_PATIENT_CONSUMABLES_SUCCESS,
    GET_PATIENT_CONSUMABLES_FAILURE,
} from "../../actions/nurse-actions/getPatientConsumablesSlice";

const initialState = {
    loadingGetPatientConsumables: false,
    getPatientConsumables: [],
    error: '',
};

export const getPatientConsumablesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PATIENT_CONSUMABLES_REQUEST:
            return { ...state, loadingGetPatientConsumables: true };
        case GET_PATIENT_CONSUMABLES_SUCCESS:
            return { ...state, loadingGetPatientConsumables: false, getPatientConsumables: action.payload };
        case GET_PATIENT_CONSUMABLES_FAILURE:
            return { ...state, loadingGetPatientConsumables: false, error: action.payload };
        default:
            return state;
    }
};