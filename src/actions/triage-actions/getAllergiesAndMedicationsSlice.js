
import { message } from 'antd';
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
        const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyAllergiesAndMedications&query=${observationNo}=No eq ‘PTL’&isList=false`, config);


        console.log('response data', data)

        Object.keys(data).length > 0 && dispatch({ type: GET_ALLERGIES_AND_MEDICATIONS_SUCCESS, payload: data });
        Object.keys(data).length === 0 && (
            dispatch({ type: GET_ALLERGIES_AND_MEDICATIONS_FAILURE, payload: "Patient not found" }),
            message.warning("No patient found with the provided patient number.", 5)
            );

    } catch (error) {
        dispatch({ type: GET_ALLERGIES_AND_MEDICATIONS_FAILURE, payload: error.message });
    }
}
