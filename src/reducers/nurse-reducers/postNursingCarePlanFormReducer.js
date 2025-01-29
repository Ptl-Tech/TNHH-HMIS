import {
    POST_NURSING_CARE_PLAN_REQUEST,
    POST_NURSING_CARE_PLAN_SUCCESS,
    POST_NURSING_CARE_PLAN_FAILURE,
    GET_NURSING_CARE_PLAN_REQUEST,
    GET_NURSING_CARE_PLAN_SUCCESS,
    GET_NURSING_CARE_PLAN_FAILURE
} from "../../actions/nurse-actions/postNursingCarePlanFormSlice";

const initialState = {
    loadingCarePlan: false,
    carePlan: [],
    error: '',
};

const getInitialState = {
    loadingGetCarePlan: false,
    getCarePlan: [],
    error: '',
}

export const postNursingCarePlanReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_NURSING_CARE_PLAN_REQUEST:
            return { ...state, loadingCarePlan: true };
        case POST_NURSING_CARE_PLAN_SUCCESS:
            return { ...state, loadingCarePlan: false, carePlan: action.payload };
        case POST_NURSING_CARE_PLAN_FAILURE:
            return { ...state, loadingCarePlan: false, error: action.payload };
        default:
            return state;
    }
};

export const getNursingCarePlanReducer = (state = getInitialState, action) => {
    switch (action.type) {
        case GET_NURSING_CARE_PLAN_REQUEST:
            return { ...state, loadingGetCarePlan: true };
        case GET_NURSING_CARE_PLAN_SUCCESS:
            return { ...state, loadingGetCarePlan: false, getCarePlan: action.payload };
        case GET_NURSING_CARE_PLAN_FAILURE:
            return { ...state, loadingGetCarePlan: false, error: action.payload };
        default:
            return state;
    }
};