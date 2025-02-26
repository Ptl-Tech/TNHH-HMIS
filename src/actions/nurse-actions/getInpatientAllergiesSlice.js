
import configHelpers  from '../../actions/configHelpers'
import axios from "axios";

export const GET_INPATIENT_ALLERGIES_REQUEST = 'GET_INPATIENT_ALLERGIES_REQUEST';
export const GET_INPATIENT_ALLERGIES_SUCCESS = 'GET_INPATIENT_ALLERGIES_SUCCESS';
export const GET_INPATIENT_ALLERGIES_FAILURE = 'GET_INPATIENT_ALLERGIES_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8085';

export const getInpatientAllergiesSlice = () => async (dispatch, getState) => {
   
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_INPATIENT_ALLERGIES_REQUEST });

        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyAllergiesAndMedications&isList=true`, config);
      
        dispatch({ type: GET_INPATIENT_ALLERGIES_SUCCESS, payload: data })

        return {  type: GET_INPATIENT_ALLERGIES_SUCCESS, payload: data };
           

    } catch (error) {
        dispatch({ 
            type: GET_INPATIENT_ALLERGIES_FAILURE, 
            payload: {
                message: error.message,
                status: error.response?.status || 'Network Error',
                data: error.response?.data || null,
            } 
        });

        return { type: GET_INPATIENT_ALLERGIES_FAILURE, payload: error };
    }
}
