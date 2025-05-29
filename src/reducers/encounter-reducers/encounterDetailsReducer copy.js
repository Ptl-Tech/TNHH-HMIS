import {
  GET_ENCOUNTER_DETAILS_FAIL,
  GET_ENCOUNTER_DETAILS_REQUEST,
  GET_ENCOUNTER_DETAILS_RESET,
  GET_ENCOUNTER_DETAILS_SUCCESS,
} from '../../actions/encounters/encounter-details';

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const getEncounterDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ENCOUNTER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_ENCOUNTER_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case GET_ENCOUNTER_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_ENCOUNTER_DETAILS_RESET:
      return initialState;
    default:
      return state;
  }
};
