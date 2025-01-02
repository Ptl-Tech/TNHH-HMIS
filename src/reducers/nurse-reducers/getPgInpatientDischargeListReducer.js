import {
    GET_PG_INPATIENT_DISCHARGE_LIST_VERIFIED_REQUEST,
    GET_PG_INPATIENT_DISCHARGE_LIST_VERIFIED_SUCCESS,
    GET_PG_INPATIENT_DISCHARGE_LIST_VERIFIED_FAILURE,
} from "../../actions/nurse-actions/getPgInpatientDischargeListSlice";

const initialState = {
    loadingGetPatientDischargeList: false,
    getPatientDischargeList: [],
    error: '',
};

export const getPgInpatientDischargeListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PG_INPATIENT_DISCHARGE_LIST_VERIFIED_REQUEST:
            return { ...state, loadingGetPatientDischargeList: true };
        case GET_PG_INPATIENT_DISCHARGE_LIST_VERIFIED_SUCCESS:
            return { ...state, loadingGetPatientDischargeList: false, getPatientDischargeList: action.payload };
        case GET_PG_INPATIENT_DISCHARGE_LIST_VERIFIED_FAILURE:
            return { ...state, loadingGetPatientDischargeList: false, error: action.payload };
        default:
            return state;
    }
};