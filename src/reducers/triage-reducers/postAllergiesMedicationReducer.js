
import {

    POST_ALLERGIES_MEDICATION_REQUEST,
    POST_ALLERGIES_MEDICATION_SUCCESS,
    POST_ALLERGIES_MEDICATION_FAIL
} from '../../actions/triage-actions/postAllergiesMedicationSlice';


const initialState = {
    postAllergyMedicationLoading: false,
    allergiesMedication: [],
    error: null,
};

export const postAllergiesMedicationReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_ALLERGIES_MEDICATION_REQUEST:
            return {
                ...state,
                postAllergyMedicationLoading: true,
                error: null,
            };
        case POST_ALLERGIES_MEDICATION_SUCCESS:
            return {
                ...state,
                postAllergyMedicationLoading: false,
                allergiesMedication: action.payload,
                error: null,
            };
        case POST_ALLERGIES_MEDICATION_FAIL:
            return {
                ...state,
                postAllergyMedicationLoading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};