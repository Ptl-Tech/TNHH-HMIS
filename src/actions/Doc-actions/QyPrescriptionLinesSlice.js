import configHelpers from '../configHelpers';
import axios from "axios";

export const GET_QY_PRESCRIPTION_LINE_REQUEST = 'GET_QY_PRESCRIPTION_LINE_REQUEST';
export const GET_QY_PRESCRIPTION_LINE_SUCCESS = 'GET_QY_PRESCRIPTION_LINE_SUCCESS';
export const GET_QY_PRESCRIPTION_LINE_FAILURE = 'GET_QY_PRESCRIPTION_LINE_FAILURE';

export const GET_INPATIENT_QY_PRESCRIPTION_LINE_REQUEST = 'GET_INPATIENT_QY_PRESCRIPTION_LINE_REQUEST';
export const GET_INPATIENT_QY_PRESCRIPTION_LINE_SUCCESS = 'GET_INPATIENT_QY_PRESCRIPTION_LINE_SUCCESS';
export const GET_INPATIENT_QY_PRESCRIPTION_LINE_FAILURE = 'GET_INPATIENT_QY_PRESCRIPTION_LINE_FAILURE';

export const POST_TREATMENT_SHEET_LINE_REQUEST = 'POST_TREATMENT_SHEET_LINE_REQUEST';
export const POST_TREATMENT_SHEET_LINE_SUCCESS = 'POST_TREATMENT_SHEET_LINE_SUCCESS';
export const POST_TREATMENT_SHEET_LINE_FAILURE = 'POST_TREATMENT_SHEET_LINE_FAILURE';

export const GET_TREATMENT_SHEET_LINE_REQUEST = 'GET_TREATMENT_SHEET_LINE_REQUEST';
export const GET_TREATMENT_SHEET_LINE_SUCCESS = 'GET_TREATMENT_SHEET_LINE_SUCCESS';
export const GET_TREATMENT_SHEET_LINE_FAILURE = 'GET_TREATMENT_SHEET_LINE_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8091';

export const getQyPrescriptionLineSlice = (treatmentNo) =>
    async (dispatch, getState) => {
        const config = configHelpers(getState);
        try {
            dispatch({ type: GET_QY_PRESCRIPTION_LINE_REQUEST });

            const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyTreatmentPrescriptionLines&isList=true&query=$filter=TreatmentNo eq '${treatmentNo}'`, config);

            dispatch({ type: GET_QY_PRESCRIPTION_LINE_SUCCESS, payload: data });

            return { type: GET_QY_PRESCRIPTION_LINE_SUCCESS, payload: data };

        } catch (error) {

            dispatch({
                type: GET_QY_PRESCRIPTION_LINE_FAILURE,
                payload: {
                    message: error.message,
                    status: error.response?.status || 'Network Error',
                    data: error.response?.data || null,
                },
            });

            return { type: GET_QY_PRESCRIPTION_LINE_FAILURE, payload: error };
        }
    };

export const getInPatientQyPrescriptionLineSlice = (admissionNo) =>
    async (dispatch, getState) => {
        const config = configHelpers(getState);
        try {
            dispatch({ type: GET_INPATIENT_QY_PRESCRIPTION_LINE_REQUEST });

            console.log('code reached here', admissionNo)
            const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyAdmissionDrugPrescribe&isList=true&query=$filter=Admission_No eq '${admissionNo}'`, config);

            dispatch({ type: GET_INPATIENT_QY_PRESCRIPTION_LINE_SUCCESS, payload: data });

            return { type: GET_INPATIENT_QY_PRESCRIPTION_LINE_SUCCESS, payload: data };

        } catch (error) {

            dispatch({
                type: GET_QY_PRESCRIPTION_LINE_FAILURE,
                payload: {
                    message: error.message,
                    status: error.response?.status || 'Network Error',
                    data: error.response?.data || null,
                },
            });

            return { type: GET_QY_PRESCRIPTION_LINE_FAILURE, payload: error };
        }
    };

export const postTreatmentSheetLineSlice = (formData) =>
    async (dispatch, getState) => {
        const config = configHelpers(getState);
        try {
            dispatch({ type: POST_TREATMENT_SHEET_LINE_REQUEST });
            const { data } = await axios.post(`${API_URL}/Inpatient/TreatmentSheetLine`, formData, config);

            dispatch({ type: POST_TREATMENT_SHEET_LINE_SUCCESS, payload: data });

            return { type: POST_TREATMENT_SHEET_LINE_SUCCESS, payload: data };

        } catch (error) {

            dispatch({
                type: POST_TREATMENT_SHEET_LINE_FAILURE,
                payload: {
                    message: error.message,
                    status: error.response?.status || 'Network Error',
                    data: error.response?.data || null,
                },
            });

            return { type: POST_TREATMENT_SHEET_LINE_FAILURE, payload: error };
        }
    };

export const getTreatmentSheetLineSlice = (admissionNo) =>
    async (dispatch, getState) => {
        const config = configHelpers(getState);
        try {
            dispatch({ type: GET_TREATMENT_SHEET_LINE_REQUEST });

            const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyTreatmentSheetLines&isList=true&query=$filter=AdmissionNo eq '${admissionNo}'`, config);

            dispatch({ type: GET_TREATMENT_SHEET_LINE_SUCCESS, payload: data });

            return { type: GET_TREATMENT_SHEET_LINE_SUCCESS, payload: data };

        } catch (error) {

            dispatch({
                type: GET_TREATMENT_SHEET_LINE_FAILURE,
                payload: {
                    message: error.message,
                    status: error.response?.status || 'Network Error',
                    data: error.response?.data || null,
                },
            });

            return { type: GET_TREATMENT_SHEET_LINE_FAILURE, payload: error };
        }
    };

