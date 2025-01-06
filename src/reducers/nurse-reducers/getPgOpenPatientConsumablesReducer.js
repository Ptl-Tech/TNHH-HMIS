import {
    GET_PG_OPEN_PATIENT_CONSUMABLES_REQUEST,
    GET_PG_OPEN_PATIENT_CONSUMABLES_SUCCESS,
    GET_PG_OPEN_PATIENT_CONSUMABLES_FAILURE,
} from "../../actions/nurse-actions/getPgOpenPatientConsumablesSlice";

const initialState = {
    loadingGetPgOpenPatientConsumables: false,
    getPgOpenPatientConsumables: [],
    error: '',
};

export const getPgOpenPatientConsumablesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PG_OPEN_PATIENT_CONSUMABLES_REQUEST:
            return { ...state, loadingGetPgOpenPatientConsumables: true };
        case GET_PG_OPEN_PATIENT_CONSUMABLES_SUCCESS:
            return { ...state, loadingGetPgOpenPatientConsumables: false, getPgOpenPatientConsumables: action.payload };
        case GET_PG_OPEN_PATIENT_CONSUMABLES_FAILURE:
            return { ...state, loadingGetPgOpenPatientConsumables: false, error: action.payload };
        default:
            return state;
    }
};