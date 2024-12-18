import {
    GET_CONSULTATION_ROOM_LIST_REQUEST,
    GET_CONSULTATION_ROOM_LIST_SUCCESS,
    GET_CONSULTATION_ROOM_LIST_FAILURE,
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