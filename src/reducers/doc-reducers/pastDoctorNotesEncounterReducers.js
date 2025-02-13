import {
    GET_PATIENT_ENCOUNTER_LIST_QUEST,
    GET_PATIENT_ENCOUNTER_LIST_SUCCESS,
    GET_PATIENT_ENCOUNTER_LIST_FAILURE,
} from "../../actions/Doc-actions/pastDoctorNotesEncounterActions";

const initialState = {
    loading: false,
    patientEncounters: [],
    error: '',
};

export const getPatientEncounterListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PATIENT_ENCOUNTER_LIST_QUEST:
            return { ...state, loading: true };
        case GET_PATIENT_ENCOUNTER_LIST_SUCCESS:
            return { ...state, loading: false, patientEncounters: action.payload };
        case GET_PATIENT_ENCOUNTER_LIST_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};