import configHelpers from '../configHelpers';
import axios from "axios";

export const GET_QY_INPATIENT_PROCESS_PROCEDURE_REQUEST = 'GET_QY_INPATIENT_PROCESS_PROCEDURE_REQUEST';
export const GET_QY_INPATIENT_PROCESS_PROCEDURE_SUCCESS = 'GET_QY_INPATIENT_PROCESS_PROCEDURE_SUCCESS';
export const GET_QY_INPATIENT_PROCESS_PROCEDURE_FAILURE = 'GET_QY_INPATIENT_PROCESS_PROCEDURE_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8085';

export const getQyInpatientProcessProceduresSlice = (admissionNo) =>
    async (dispatch, getState) => {
        const config = configHelpers(getState);
        try {
            dispatch({ type: GET_QY_INPATIENT_PROCESS_PROCEDURE_REQUEST });

            const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyInpatientProcessProcedures&isList=true&query=$filter=AdmissionNo eq '${admissionNo}' `, config);

            dispatch({ type: GET_QY_INPATIENT_PROCESS_PROCEDURE_SUCCESS, payload: data });

            return { type: GET_QY_INPATIENT_PROCESS_PROCEDURE_SUCCESS, payload: data };

        } catch (error) {

            dispatch({
                type: GET_QY_INPATIENT_PROCESS_PROCEDURE_FAILURE,
                payload: {
                    message: error.message,
                    status: error.response?.status || 'Network Error',
                    data: error.response?.data || null,
                },
            });

            return { type: GET_QY_INPATIENT_PROCESS_PROCEDURE_FAILURE, payload: error };
        }
    };
