import {
  POST_PHARMACY_DRUG_ISSUANCE_REQUEST,
  POST_PHARMACY_DRUG_ISSUANCE_SUCCESS,
  POST_PHARMACY_DRUG_ISSUANCE_FAILURE,
  POST_PHARMACY_DRUG_ISSUANCE_RESET,
  POST_ARCHIVE_PRESCRIPTION_REQUEST,
  POST_ARCHIVE_PRESCRIPTION_SUCCESS,
  POST_ARCHIVE_PRESCRIPTION_FAILURE,
  POST_ARCHIVE_PRESCRIPTION_RESET,
  POST_EDIT_PRESCRIPTION_REQUEST,
  POST_EDIT_PRESCRIPTION_SUCCESS,
  POST_EDIT_PRESCRIPTION_FAILURE,
  POST_EDIT_PRESCRIPTION_RESET,
} from '../../actions/pharmacy-actions/postPharmacyAction';

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const postPrescriptionQuantityReducer = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case POST_EDIT_PRESCRIPTION_REQUEST:
      return { ...state, loading: true };
    case POST_EDIT_PRESCRIPTION_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_EDIT_PRESCRIPTION_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case POST_EDIT_PRESCRIPTION_RESET:
      return initialState;
    default:
      return state;
  }
};

export const postDrugIssuanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_PHARMACY_DRUG_ISSUANCE_REQUEST:
      return { ...state, loading: true };
    case POST_PHARMACY_DRUG_ISSUANCE_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case POST_PHARMACY_DRUG_ISSUANCE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case POST_PHARMACY_DRUG_ISSUANCE_RESET:
      return initialState;
    default:
      return state;
  }
};

export const postArchivePrescriptionReducer = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case POST_ARCHIVE_PRESCRIPTION_REQUEST:
      return { ...state, loading: true };
    case POST_ARCHIVE_PRESCRIPTION_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case POST_ARCHIVE_PRESCRIPTION_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case POST_ARCHIVE_PRESCRIPTION_RESET:
      return initialState;
    default:
      return state;
  }
};
