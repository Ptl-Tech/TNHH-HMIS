import configHelpers from '../configHelpers';
import axios from "axios";

export const GET_QY_TREATMENT_DIAGNOSIS_LINES_REQUEST = 'GET_QY_TREATMENT_DIAGNOSIS_LINES_REQUEST';
export const GET_QY_TREATMENT_DIAGNOSIS_LINES_SUCCESS = 'GET_QY_TREATMENT_DIAGNOSIS_LINES_SUCCESS';
export const GET_QY_TREATMENT_DIAGNOSIS_LINES_FAILURE = 'GET_QY_TREATMENT_DIAGNOSIS_LINES_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const getQyTreatmentDiagnosisLinesSlice = () => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_QY_TREATMENT_DIAGNOSIS_LINES_REQUEST });

        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyTreatmentDiagnosisLines&isList=true`, config);
    

        dispatch({ type: GET_QY_TREATMENT_DIAGNOSIS_LINES_SUCCESS, payload: data });

        return { type: GET_QY_TREATMENT_DIAGNOSIS_LINES_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: GET_QY_TREATMENT_DIAGNOSIS_LINES_FAILURE,
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            },
        });

        return { type: GET_QY_TREATMENT_DIAGNOSIS_LINES_FAILURE, payload: error };
    }
};
