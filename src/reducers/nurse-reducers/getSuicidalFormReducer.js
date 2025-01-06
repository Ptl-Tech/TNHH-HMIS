import {
    GET_SUICIDAL_FORM_REQUEST,
    GET_SUICIDAL_FORM_SUCCESS,
    GET_SUICIDAL_FORM_FAILURE,
} from "../../actions/nurse-actions/getSuicidalFormSlice";

const initialState = {
    loadingIpSuicidalForm: false,
    ipSuicidalForm: [],
    error: '',
};

export const getSuicidalFormReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SUICIDAL_FORM_REQUEST:
            console.log('started')
            return { ...state, loadingIpSuicidalForm: true };
        case GET_SUICIDAL_FORM_SUCCESS:
            console.log('success')
            return { ...state, loadingIpSuicidalForm: false, ipSuicidalForm: action.payload };
        case GET_SUICIDAL_FORM_FAILURE:
            console.log('failure')
            return { ...state, loadingIpSuicidalForm: false, error: action.payload };
        default:
            return state;
    }
};