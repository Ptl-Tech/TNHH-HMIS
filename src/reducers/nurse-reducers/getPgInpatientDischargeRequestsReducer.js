import {
    GET_PG_INPATIENT_DISCHARGE_REQUEST_REQUEST,
    GET_PG_INPATIENT_DISCHARGE_REQUEST_SUCCESS,
    GET_PG_INPATIENT_DISCHARGE_REQUEST_FAILURE,
} from "../../actions/nurse-actions/getPgInpatientDischargeRequestsSlice";

const initialState = {
    loadingGetInpatientDischargeRequests: false,
    getInpatientDischargeRequest: [],
    error: '',
};

export const getPgInpatientDischargeRequestsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PG_INPATIENT_DISCHARGE_REQUEST_REQUEST:
            return { ...state, loadingGetInpatientDischargeRequests: true };
        case GET_PG_INPATIENT_DISCHARGE_REQUEST_SUCCESS:
            return { ...state, loadingGetInpatientDischargeRequests: false, getInpatientDischargeRequest: action.payload };
        case GET_PG_INPATIENT_DISCHARGE_REQUEST_FAILURE:
            return { ...state, loadingGetInpatientDischargeRequests: false, error: action.payload };
        default:
            return state;
    }
};