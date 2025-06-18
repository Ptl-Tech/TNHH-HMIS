export const SET_CURRENT_INPATIENT = "SET_CURRENT_INPATIENT";
export const SET_CURRENT_INPATIENT_ERROR = "SET_CURRENT_INPATIENT_ERROR";

export const currentInpatient = (data) => (dispatch) => {
  try {
    if (!data) throw new Error("The Inpatient record is not null");
    dispatch({ type: SET_CURRENT_INPATIENT, payload: { data } });
  } catch (error) {
    dispatch({
      type: SET_CURRENT_INPATIENT_ERROR,
      payload: { error: error.message },
    });
  }
};
