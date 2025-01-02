import {
    GET_NURSE_ADMISSION_NOTES_REQUEST,
    GET_NURSE_ADMISSION_NOTES_SUCCESS,
    GET_NURSE_ADMISSION_NOTES_FAILURE,
} from "../../actions/nurse-actions/getNurseAdmissionNotesSlice";

const initialState = {
    loadingGetNurseAdmissionNotes: false,
    getNurseNotes: [],
    error: '',
};

export const getNurseAdmissionNotesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_NURSE_ADMISSION_NOTES_REQUEST:
            return { ...state, loadingGetNurseAdmissionNotes: true };
        case GET_NURSE_ADMISSION_NOTES_SUCCESS:
            return { ...state, loadingGetNurseAdmissionNotes: false, getNurseNotes: action.payload };
        case GET_NURSE_ADMISSION_NOTES_FAILURE:
            return { ...state, loadingGetNurseAdmissionNotes: false, error: action.payload };
        default:
            return state;
    }
};