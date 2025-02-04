import configHelpers from '../configHelpers';
import axios from "axios";

export const POST_RELEASE_BED_REQUEST = 'POST_RELEASE_BED_REQUEST';
export const POST_RELEASE_BED_SUCCESS = 'POST_RELEASE_BED_SUCCESS';
export const POST_RELEASE_BED_FAILURE = 'POST_RELEASE_BED_FAILURE';

const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'https://chiromo.potestastechnologies.net:8085';

export const postReleaseBedSlice = (dischargeData) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: POST_RELEASE_BED_REQUEST });

        const { data } = await axios.post(`${API_URL}/Inpatient/ReleaseBed`, dischargeData, config);
    

        dispatch({ type: POST_RELEASE_BED_SUCCESS, payload: data });

        return { type: POST_RELEASE_BED_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: POST_RELEASE_BED_FAILURE,
            payload: error.response?.data?.message || error.message,
        });

        return { type: POST_RELEASE_BED_FAILURE, payload: error };
    }
};
