import {
    GET_PG_INPATIENT_DISCHARGE_LIST_VERIFIED_REQUEST,
    GET_PG_INPATIENT_DISCHARGE_LIST_VERIFIED_SUCCESS,
    GET_PG_INPATIENT_DISCHARGE_LIST_VERIFIED_FAILURE,
    GET_QY_INPATIENT_DISCHARGE_LIST_ENCOUNTERS_REQUEST,
    GET_QY_INPATIENT_DISCHARGE_LIST_ENCOUNTERS_SUCCESS,
    GET_QY_INPATIENT_DISCHARGE_LIST_ENCOUNTERS_FAILURE
} from "../../actions/nurse-actions/getPgInpatientDischargeListSlice";

const initialState = {
    loadingGetPatientDischargeList: false,
    getPatientDischargeList: [],
    error: '',
};

const initialStateEncounters ={
    loading: false,
    data: [],
    error: '',
}

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

export const getQyAdmissionsDischargedListReducer = (state = initialStateEncounters, action) => {
    switch (action.type) {
        case GET_QY_INPATIENT_DISCHARGE_LIST_ENCOUNTERS_REQUEST:
            return { ...state, loading: true };
        case GET_QY_INPATIENT_DISCHARGE_LIST_ENCOUNTERS_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case GET_QY_INPATIENT_DISCHARGE_LIST_ENCOUNTERS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};