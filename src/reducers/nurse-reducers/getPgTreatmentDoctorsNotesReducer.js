import {
    GET_PG_TREATMENT_DOCTOR_NOTES_REQUEST,
    GET_PG_TREATMENT_DOCTOR_NOTES_SUCCESS,
    GET_PG_TREATMENT_DOCTOR_NOTES_FAILURE,
} from "../../actions/nurse-actions/getPgTreatmentDoctorsNotesSlice";

const initialState = {
    loadingGetDoctorNotes: false,
    getDoctorNotes: [],
    error: '',
};

export const getPgTreatmentDoctorNotesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PG_TREATMENT_DOCTOR_NOTES_REQUEST:
            return { ...state, loadingGetDoctorNotes: true };
        case GET_PG_TREATMENT_DOCTOR_NOTES_SUCCESS:
            return { ...state, loadingGetDoctorNotes: false, getDoctorNotes: action.payload };
        case GET_PG_TREATMENT_DOCTOR_NOTES_FAILURE:
            return { ...state, loadingGetDoctorNotes: false, error: action.payload };
        default:
            return state;
    }
};