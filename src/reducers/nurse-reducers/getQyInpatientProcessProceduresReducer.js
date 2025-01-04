import {
    GET_QY_INPATIENT_PROCESS_PROCEDURE_REQUEST,
    GET_QY_INPATIENT_PROCESS_PROCEDURE_SUCCESS,
    GET_QY_INPATIENT_PROCESS_PROCEDURE_FAILURE,
} from "../../actions/nurse-actions/getQyInpatientProcessProceduresSlice";

const initialState = {
    loadingGetIpProcedure: false,
    ipGetProcedure: [],
    error: '',
};

export const getQyInpatientProcessProceduresReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_QY_INPATIENT_PROCESS_PROCEDURE_REQUEST:
            return { ...state, loadingGetIpProcedure: true };
        case GET_QY_INPATIENT_PROCESS_PROCEDURE_SUCCESS:
            return { ...state, loadingGetIpProcedure: false, ipGetProcedure: action.payload };
        case GET_QY_INPATIENT_PROCESS_PROCEDURE_FAILURE:
            return { ...state, loadingGetIpProcedure: false, error: action.payload };
        default:
            return state;
    }
};