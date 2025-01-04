import {
    GET_INPATIENT_ALLERGIES_REQUEST,
    GET_INPATIENT_ALLERGIES_SUCCESS,
    GET_INPATIENT_ALLERGIES_FAILURE,
} from "../../actions/nurse-actions/getInpatientAllergiesSlice";

const initialState = {
    loadingAllergies: false,
    allergies: [],
    error: '',
};

export const getInpatientAllergiesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_INPATIENT_ALLERGIES_REQUEST:
            return { ...state, loadingAllergies: true };
        case GET_INPATIENT_ALLERGIES_SUCCESS:
            return { ...state, loadingAllergies: false, allergies: action.payload };
        case GET_INPATIENT_ALLERGIES_FAILURE:
            return { ...state, loadingAllergies: false, error: action.payload };
        default:
            return state;
    }
};