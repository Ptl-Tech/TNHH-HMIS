export const GET_PATIENT_LINES_REQUEST = "GET_PATIENT_LINES_REQUEST";
export const GET_PATIENT_LINES_SUCCESS = "GET_PATIENT_LINES_SUCCESS";
export const GET_PATIENT_LINES_FAIL = "GET_PATIENT_LINES_FAIL";
export const GET_PATIENT_LINES_RESET = "GET_PATIENT_LINES_RESET";

export const getPatientSignsLinesReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case GET_PATIENT_LINES_REQUEST:
      return { loading: true, data: [] };
    case GET_PATIENT_LINES_SUCCESS:
      return { loading: false, data: action.payload };
    case GET_PATIENT_LINES_FAIL:
      return { loading: false, error: action.payload };
    case GET_PATIENT_LINES_RESET:
      return { loading: false };
    default:
      return state;
  }
};
