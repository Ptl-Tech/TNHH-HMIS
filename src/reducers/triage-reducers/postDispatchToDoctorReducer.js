
import {

    POST_DISPATCH_TO_DOCTOR_REQUEST,
    POST_DISPATCH_TO_DOCTOR_SUCCESS,
    POST_DISPATCH_TO_DOCTOR_FAIL
} from '../../actions/triage-actions/postDispatchToDoctorSlice';


const initialState = {
    loadingDispatchToDoctor: false,
    dispatchToDoctor: [],
    error: null,
};

export const postDispatchToDoctorReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_DISPATCH_TO_DOCTOR_REQUEST:
            return {
                ...state,
                loadingDispatchToDoctor: true,
                error: null,
            };
        case POST_DISPATCH_TO_DOCTOR_SUCCESS:
            return {
                ...state,
                loadingDispatchToDoctor: false,
                dispatchToDoctor: action.payload,
                error: null,
            };
        case POST_DISPATCH_TO_DOCTOR_FAIL:
            return {
                ...state,
                loadingDispatchToDoctor: false,
                error: action.payload,
            };
        default:
            return state;
    }
};