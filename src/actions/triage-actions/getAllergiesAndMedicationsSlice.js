
import configHelpers  from '../../actions/configHelpers'
import axios from "axios";

export const GET_ALLERGIES_AND_MEDICATIONS_REQUEST = 'GET_ALLERGIES_AND_MEDICATIONS_REQUEST';
export const GET_ALLERGIES_AND_MEDICATIONS_SUCCESS = 'GET_ALLERGIES_AND_MEDICATIONS_SUCCESS';
export const GET_ALLERGIES_AND_MEDICATIONS_FAILURE = 'GET_ALLERGIES_AND_MEDICATIONS_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const getAllergiesAndMedicationsSlice = (observationNo) => async (dispatch, getState) => {
   
    const config = configHelpers(getState);
    try {
        dispatch({ type: GET_ALLERGIES_AND_MEDICATIONS_REQUEST });

        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyAllergiesAndMedications&isList=false&query=$filter=ObservationNo eq '${observationNo}'`, config);
      
        dispatch({ type: GET_ALLERGIES_AND_MEDICATIONS_SUCCESS, payload: data })

        console.log('logging the response data', data);
           

    } catch (error) {
        dispatch({ type: GET_ALLERGIES_AND_MEDICATIONS_FAILURE, payload: error.message });
    }
}
