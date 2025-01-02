import {
    POST_NURSE_ADMISSION_NOTES_REQUEST,
    POST_NURSE_ADMISSION_NOTES_SUCCESS,
    POST_NURSE_ADMISSION_NOTES_FAILURE,
} from "../../actions/nurse-actions/postNurseAdmissionNotesSlice";

const initialState = {
    loadingNurseNotes: false,
    postNurseNotes: [],
    error: '',
};

export const postNurseAdmissionNotesReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_NURSE_ADMISSION_NOTES_REQUEST:
            return { ...state, loadingNurseNotes: true };
        case POST_NURSE_ADMISSION_NOTES_SUCCESS:
            return { ...state, loadingNurseNotes: false, postNurseNotes: action.payload };
        case POST_NURSE_ADMISSION_NOTES_FAILURE:
            return { ...state, loadingNurseNotes: false, error: action.payload };
        default:
            return state;
    }
};