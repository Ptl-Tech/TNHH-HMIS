import {
  GET_ENCOUNTER_LIST_FAIL,
  GET_ENCOUNTER_LIST_REQUEST,
  GET_ENCOUNTER_LIST_RESET,
  GET_ENCOUNTER_LIST_SUCCESS,
} from '../../actions/encounters/encounter-list';

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const getEncounterListReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ENCOUNTER_LIST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_ENCOUNTER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case GET_ENCOUNTER_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_ENCOUNTER_LIST_RESET:
      return initialState;
    default:
      return state;
  }
};
