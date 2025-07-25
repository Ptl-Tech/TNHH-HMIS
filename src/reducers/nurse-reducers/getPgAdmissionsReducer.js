import {
  GET_PG_ADMISSIONS_REQUEST,
  GET_PG_ADMISSIONS_SUCCESS,
  GET_PG_ADMISSIONS_FAILURE,
  GET_PG_ADMISSIONS_RESET,
} from "../../actions/nurse-actions/getPgAdmissionsAdmittedSlice";

const initialState = {
  error: "",
  admittedPatients: [],
  loadingAdmittedPatients: false,
};

export const getAdmissionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PG_ADMISSIONS_REQUEST:
      return { ...state, loadingAdmittedPatients: true };

    case GET_PG_ADMISSIONS_SUCCESS:
      return {
        ...state,
        loadingAdmittedPatients: false,
        admittedPatients: action.payload,
        error: "", // Optional: reset error on success
      };

    case GET_PG_ADMISSIONS_FAILURE:
      return {
        ...state,
        loadingAdmittedPatients: false,
        error: action.payload,
      };

    case GET_PG_ADMISSIONS_RESET:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};
