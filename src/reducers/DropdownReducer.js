import {
  QY_SYMPTOMS_LIST_REQUEST,
  QY_SYMPTOMS_LIST_SUCCESS,
  QY_SYMPTOMS_LIST_FAIL,
  QY_SYMPTOMS_LIST_RESET,
  QY_SIGNS_LIST_REQUEST,
  QY_SIGNS_LIST_SUCCESS,
  QY_SIGNS_LIST_FAIL,
  QY_SIGNS_LIST_RESET,
  QY_HMS_LIST_REQUEST,
  QY_HMS_LIST_SUCCESS,
  QY_HMS_LIST_FAIL,
  QY_HMS_LIST_RESET,
  QY_LAB_TEST_LIST_REQUEST,
  QY_LAB_TEST_LIST_SUCCESS,
  QY_LAB_TEST_LIST_FAIL,
  QY_LAB_TEST_LIST_RESET,
  QY_RADIOLOGY_TEST_LIST_REQUEST,
  QY_RADIOLOGY_TEST_LIST_SUCCESS,
  QY_RADIOLOGY_TEST_LIST_FAIL,
  QY_RADIOLOGY_TEST_LIST_RESET,
  QY_DIAGNOSIS_LIST_REQUEST,
  QY_DIAGNOSIS_LIST_SUCCESS,
  QY_DIAGNOSIS_LIST_FAIL,
  QY_DIAGNOSIS_LIST_RESET,
} from "../constants/doc-constants/QySymptomConstants";
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
  KINS_LIST_REQUEST,
  KINS_LIST_SUCCESS,
  KINS_LIST_FAIL,
  KINS_LIST_RESET,
  INSURANCE_LIST_REQUEST,
  INSURANCE_LIST_SUCCESS,
  INSURANCE_LIST_FAIL,
  INSURANCE_LIST_RESET,
  DOCTOR_LIST_REQUEST,
  DOCTOR_LIST_SUCCESS,
  DOCTOR_LIST_FAIL,
  DOCTOR_LIST_RESET,
  EMPLOYEES_LIST_REQUEST,
  EMPLOYEES_LIST_SUCCESS,
  EMPLYEES_LIST_FAIL,
  EMPLOYEES_LIST_RESET,
  MARKETING_LIST_REQUEST,
  MARKETING_LIST_SUCCESS,
  MARKETING_LIST_FAIL,
  MARKETING_LIST_RESET,
  EMPLOYEE_DETAILS_REQUEST,
  EMPLOYEE_DETAILS_SUCCESS,
  EMPLOYEE_DETAILS__FAIL,
  EMPLOYEE_DETAILS_RESET,
  LOCATION_LIST_REQUEST,
  LOCATION_LIST_SUCCESS,
  LOCATION_LIST_FAIL,
  LOCATION_LIST_RESET,
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

export const getrelationshipOptionsReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case KINS_LIST_REQUEST:
      return { loading: true, data: [] };
    case KINS_LIST_SUCCESS:
      return { loading: false, data: action.payload };
    case KINS_LIST_FAIL:
      return { loading: false, error: action.payload };
    case KINS_LIST_RESET:
      return { data: [] };
    default:
      return state;
  }
};

export const getInsuranceReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case INSURANCE_LIST_REQUEST:
      return { loading: true, data: [] };
    case INSURANCE_LIST_SUCCESS:
      return { loading: false, data: action.payload };
    case INSURANCE_LIST_FAIL:
      return { loading: false, error: action.payload };
    case INSURANCE_LIST_RESET:
      return { data: [] };
    default:
      return state;
  }
};

export const getmarketingStrategiesReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case MARKETING_LIST_REQUEST:
      return { loading: true, data: [] };
    case MARKETING_LIST_SUCCESS:
      return { loading: false, data: action.payload };
    case MARKETING_LIST_FAIL:
      return { loading: false, error: action.payload };
    case MARKETING_LIST_RESET:
      return { data: [] };
    default:
      return state;
  }
};

export const getdoctorListReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case DOCTOR_LIST_REQUEST:
      return { loading: true, data: [] };
    case DOCTOR_LIST_SUCCESS:
      return { loading: false, data: action.payload };
    case DOCTOR_LIST_FAIL:
      return { loading: false, error: action.payload };
    case DOCTOR_LIST_RESET:
      return { data: [] };
    default:
      return state;
  }
};

export const getemployeesListReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case EMPLOYEES_LIST_REQUEST:
      return { loading: true, data: [] };
    case EMPLOYEES_LIST_SUCCESS:
      return { loading: false, data: action.payload };
    case EMPLYEES_LIST_FAIL:
      return { loading: false, error: action.payload };
    case EMPLOYEES_LIST_RESET:
      return { data: [] };
    default:
      return state;
  }
};
export const getemployeeDetailsReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case EMPLOYEE_DETAILS_REQUEST:
      return { loading: true, data: [] };
    case EMPLOYEE_DETAILS_SUCCESS:
      return { loading: false, data: action.payload };
    case EMPLOYEE_DETAILS__FAIL:
      return { loading: false, error: action.payload };
    case EMPLOYEE_DETAILS_RESET:
      return { data: [] };
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

export const QyLocationsListReducer = (state = { locations: [] }, action) => {
  switch (action.type) {
    case LOCATION_LIST_REQUEST:
      return { loading: true, locations: [] };
    case LOCATION_LIST_SUCCESS:
      return { loading: false, locations:action.payload };
    case LOCATION_LIST_FAIL:
      return { loading: false, error: action.payload };
    case LOCATION_LIST_RESET:
      return { locations: [] };
    default:
      return state;
  }
};

export const QySymptomsSetupReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case QY_SYMPTOMS_LIST_REQUEST:
      return { loading: true, data: [] };
    case QY_SYMPTOMS_LIST_SUCCESS:
      return { loading: false, data: action.payload };
    case QY_SYMPTOMS_LIST_FAIL:
      return { loading: false, error: action.payload };
    case QY_SYMPTOMS_LIST_RESET:
      return { data: [] };
    default:
      return state;
  }
};

export const QySignsSetupReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case QY_SIGNS_LIST_REQUEST:
      return { loading: true, data: [] };
    case QY_SIGNS_LIST_SUCCESS:
      return { loading: false, data: action.payload };
    case QY_SIGNS_LIST_FAIL:
      return { loading: false, error: action.payload };
    case QY_SIGNS_LIST_RESET:
      return { data: [] };
    default:
      return state;
  }
};

export const QYHMSReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case QY_HMS_LIST_REQUEST:
      return { loading: true, data: [] };
    case QY_HMS_LIST_SUCCESS:
      return { loading: false, data: action.payload };
    case QY_HMS_LIST_FAIL:
      return { loading: false, error: action.payload };
    case QY_HMS_LIST_RESET:
      return { data: [] };
    default:
      return state;
  }
};


export const QyLabTestsSetupReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case QY_LAB_TEST_LIST_REQUEST:
      return { loading: true, data: [] };
    case QY_LAB_TEST_LIST_SUCCESS:
      return { loading: false, data: action.payload };
    case QY_LAB_TEST_LIST_FAIL:
      return { loading: false, error: action.payload };
    case QY_LAB_TEST_LIST_RESET:
      return { data: [] };
    default:
      return state;
  }
}


export const QyRadiologyTestsSetupReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case QY_RADIOLOGY_TEST_LIST_REQUEST:
      return { loading: true, data: [] };
    case QY_RADIOLOGY_TEST_LIST_SUCCESS:
      return { loading: false, data: action.payload };
    case QY_RADIOLOGY_TEST_LIST_FAIL:
      return { loading: false, error: action.payload };
    case QY_RADIOLOGY_TEST_LIST_RESET:
      return { data: [] };
    default:
      return state;
  }
}


export const QyDiagnosisTestsSetupReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case QY_DIAGNOSIS_LIST_REQUEST:
      return { loading: true, data: [] };
    case QY_DIAGNOSIS_LIST_SUCCESS:
      return { loading: false, data: action.payload };
    case QY_DIAGNOSIS_LIST_FAIL:
      return { loading: false, error: action.payload };
    case QY_DIAGNOSIS_LIST_RESET:
      return { data: [] };
    default:
      return state;
  }
}

