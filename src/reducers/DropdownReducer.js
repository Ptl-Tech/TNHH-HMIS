import {
  COUNTRIES_LIST_FAIL,
  COUNTRIES_LIST_REQUEST,
  COUNTRIES_LIST_RESET,
  COUNTRIES_LIST_SUCCESS,
  COUNTIES_LIST_FAIL,
  COUNTIES_LIST_REQUEST,
  COUNTIES_LIST_RESET,
  COUNTIES_LIST_SUCCESS,
  SUB_COUNTIES_LIST_RESET,
  SUB_COUNTIES_LIST_FAIL,
  SUB_COUNTIES_LIST_REQUEST,
  SUB_COUNTIES_LIST_SUCCESS,
  CLINICS_LIST_REQUEST,
  CLINICS_LIST_SUCCESS,
  CLINICS_LIST_FAIL,
  CLINICS_LIST_RESET,
} from "../constants/DropDownConstants";

export const countriesListReducer = (state = { countries: [] }, action) => {
  switch (action.type) {
    case COUNTRIES_LIST_REQUEST:
      return { loading: true, countries: [] };
    case COUNTRIES_LIST_SUCCESS:
      return { loading: false, countries: action.payload };
    case COUNTRIES_LIST_FAIL:
      return { loading: false, error: action.payload };
    case COUNTRIES_LIST_RESET:
      return { countries: [] };
    default:
      return state;
  }
};

export const countiesListReducer = (state = { counties: [] }, action) => {
  switch (action.type) {
    case COUNTIES_LIST_REQUEST:
      return { loading: true, counties: [] };
    case COUNTIES_LIST_SUCCESS:
      return { loading: false, counties: action.payload };
    case COUNTIES_LIST_FAIL:
      return { loading: false, error: action.payload };
    case COUNTIES_LIST_RESET:
      return { counties: [] };
    default:
      return state;
  }
};

export const clinicsListReducer = (state = { clinics: [] }, action) => {
  switch (action.type) {
    case CLINICS_LIST_REQUEST:
      return { loading: true, clinics: [] };
    case CLINICS_LIST_SUCCESS:
      return { loading: false, clinics: action.payload };
    case CLINICS_LIST_FAIL:
      return { loading: false, error: action.payload };
    case CLINICS_LIST_RESET:
      return { clinics: [] };
    default:
      return state;
  }
};

export const subCountiesListReducer = (state = { subCounties: [] }, action) => {
  switch (action.type) {
    case SUB_COUNTIES_LIST_REQUEST:
      return { loading: true, subCounties: [] };
    case SUB_COUNTIES_LIST_SUCCESS:
      return { loading: false, subCounties: action.payload };
    case SUB_COUNTIES_LIST_FAIL:
      return { loading: false, error: action.payload };
    case SUB_COUNTIES_LIST_RESET:
      return { subCounties: [] };
    default:
      return state;
  }
};
