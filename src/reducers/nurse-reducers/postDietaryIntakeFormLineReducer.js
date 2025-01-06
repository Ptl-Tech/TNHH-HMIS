import {
    POST_DIETARY_INTAKE_FORM_LINE_REQUEST,
    POST_DIETARY_INTAKE_FORM_LINE_SUCCESS,
    POST_DIETARY_INTAKE_FORM_LINE_FAILURE,
} from "../../actions/nurse-actions/postDietaryIntakeFormLineSlice";

const initialState = {
    loadingDietaryIntake: false,
    dietaryIntake: [],
    error: '',
};

export const postDietaryIntakeFormLineReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_DIETARY_INTAKE_FORM_LINE_REQUEST:
            return { ...state, loadingDietaryIntake: true };
        case POST_DIETARY_INTAKE_FORM_LINE_SUCCESS:
            return { ...state, loadingDietaryIntake: false, dietaryIntake: action.payload };
        case POST_DIETARY_INTAKE_FORM_LINE_FAILURE:
            return { ...state, loadingDietaryIntake: false, error: action.payload };
        default:
            return state;
    }
};