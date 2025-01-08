import {
    GET_PG_ROOMS_SETUP_REQUEST,
    GET_PG_WARD_ROOMS_SETUP_SUCCESS,
    GET_PG_WARD_ROOMS_SETUP_FAILURE,
} from "../../actions/nurse-actions/getPgWardRoomsSetupSlice";

const initialState = {
    loadingWardRooms: false,
    wardRooms: [],
    error: '',
};

export const getPgWardRoomsSetupReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PG_ROOMS_SETUP_REQUEST:
            return { ...state, loadingWardRooms: true };
        case GET_PG_WARD_ROOMS_SETUP_SUCCESS:
            return { ...state, loadingWardRooms: false, wardRooms: action.payload };
        case GET_PG_WARD_ROOMS_SETUP_FAILURE:
            return { ...state, loadingWardRooms: false, error: action.payload };
        default:
            return state;
    }
};


