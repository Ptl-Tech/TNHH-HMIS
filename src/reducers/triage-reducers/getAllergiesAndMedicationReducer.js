import {
    GET_ALLERGIES_AND_MEDICATIONS_REQUEST,
    GET_ALLERGIES_AND_MEDICATIONS_SUCCESS,
    GET_ALLERGIES_AND_MEDICATIONS_FAILURE,
} from "../../actions/triage-actions/getAllergiesAndMedicationsSlice";

const initialState = {
    loadingGetAllergiesAndMedications: false,
    allergiesMedication: [],
    error: '',
};

export const getAllergiesAndMedicationReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALLERGIES_AND_MEDICATIONS_REQUEST:
            return { ...state, loadingGetAllergiesAndMedications: true };
        case GET_ALLERGIES_AND_MEDICATIONS_SUCCESS:
            return { ...state, loadingGetAllergiesAndMedications: false, allergiesMedication: action.payload };
        case GET_ALLERGIES_AND_MEDICATIONS_FAILURE:
            return { ...state, loadingGetAllergiesAndMedications: false, error: action.payload };
        default:
            return state;
    }
};