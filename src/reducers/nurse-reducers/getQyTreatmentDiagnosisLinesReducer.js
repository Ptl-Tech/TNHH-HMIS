import {
    GET_QY_TREATMENT_DIAGNOSIS_LINES_REQUEST,
    GET_QY_TREATMENT_DIAGNOSIS_LINES_SUCCESS,
    GET_QY_TREATMENT_DIAGNOSIS_LINES_FAILURE,
} from "../../actions/nurse-actions/getQyTreatmentDiagnosisLinesSlice";

const initialState = {
    loadingGetDoctorDiagnosis: false,
    getDiagnosis: [],
    error: '',
};

export const getQyTreatmentDiagnosisLinesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_QY_TREATMENT_DIAGNOSIS_LINES_REQUEST:
            return { ...state, loadingGetDoctorDiagnosis: true };
        case GET_QY_TREATMENT_DIAGNOSIS_LINES_SUCCESS:
            return { ...state, loadingGetDoctorDiagnosis: false, getDiagnosis: action.payload };
        case GET_QY_TREATMENT_DIAGNOSIS_LINES_FAILURE:
            return { ...state, loadingGetDoctorDiagnosis: false, error: action.payload };
        default:
            return state;
    }
};