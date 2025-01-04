import {
    POST_DAILY_PROCEDURE_OR_PROCESS_REQUEST,
    POST_DAILY_PROCEDURE_OR_PROCESS_SUCCESS,
    POST_DAILY_PROCEDURE_OR_PROCESS_FAILURE,
} from "../../actions/nurse-actions/postDailyProcedureOrProcessSlice";

const initialState = {
    loadingDailyProcedure: false,
    dailyProcedure: [],
    error: '',
};

export const postDailyProcedureOrProcessReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_DAILY_PROCEDURE_OR_PROCESS_REQUEST:
            return { ...state, loadingDailyProcedure: true };
        case POST_DAILY_PROCEDURE_OR_PROCESS_SUCCESS:
            return { ...state, loadingDailyProcedure: false, dailyProcedure: action.payload };
        case POST_DAILY_PROCEDURE_OR_PROCESS_FAILURE:
            return { ...state, loadingDailyProcedure: false, error: action.payload };
        default:
            return state;
    }
};