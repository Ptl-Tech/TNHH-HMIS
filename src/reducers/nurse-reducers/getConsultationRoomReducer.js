import {
    GET_CONSULTATION_ROOM_LIST_REQUEST,
    GET_CONSULTATION_ROOM_LIST_SUCCESS,
    GET_CONSULTATION_ROOM_LIST_FAILURE,
    GET_CONSULTATION_ROOM_DETAILS_REQUEST,
    GET_CONSULTATION_ROOM_DETAILS_SUCCESS,
    GET_CONSULTATION_ROOM_DETAILS_FAILURE,
    GET_CONSULTATION_REQUEST,
    GET_CONSULTATION_SUCCESS,
    GET_CONSULTATION_FAILURE,
} from "../../actions/nurse-actions/getConsultationRoomSlice";

const initialState = {
    loadingConsultationRoomList: false,
    consultationRoomList: [],
    error: '',
};

export const getConsultationRoomListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CONSULTATION_ROOM_LIST_REQUEST:
            return { ...state, loadingConsultationRoomList: true };
        case GET_CONSULTATION_ROOM_LIST_SUCCESS:
            return { ...state, loadingConsultationRoomList: false, consultationRoomList: action.payload };
        case GET_CONSULTATION_ROOM_LIST_FAILURE:
            return { ...state, loadingConsultationRoomList: false, error: action.payload };
        default:
            return state;
    }
};

export const getSingleConsultationRoomReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CONSULTATION_ROOM_DETAILS_REQUEST:
            return { ...state, loadingConsultationRoomList: true };
        case GET_CONSULTATION_ROOM_DETAILS_SUCCESS:
            return { ...state, loadingConsultationRoomList: false, consultationRoomList: action.payload };
        case GET_CONSULTATION_ROOM_DETAILS_FAILURE:
            return { ...state, loadingConsultationRoomList: false, error: action.payload };
        default:
            return state;
    }
}

// get consultation with patientNo
export const getConsultationReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CONSULTATION_REQUEST:
            return { ...state, loadingConsultationRoomList: true };
        case GET_CONSULTATION_SUCCESS:
            return { ...state, loadingConsultationRoomList: false, consultationRoomList: action.payload };
        case GET_CONSULTATION_FAILURE:
            return { ...state, loadingConsultationRoomList: false, error: action.payload };
        default:
            return state;
    }
}
