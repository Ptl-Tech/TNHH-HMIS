
import configHelpers from '../configHelpers';
import axios from "axios";

export const POST_RELEASE_BED_REQUEST = 'POST_RELEASE_BED_REQUEST';
export const POST_RELEASE_BED_SUCCESS = 'POST_RELEASE_BED_SUCCESS';
export const POST_RELEASE_BED_FAILURE = 'POST_RELEASE_BED_FAILURE';

export const POST_BED_TRANSFER_LINE_REQUEST = 'POST_BED_TRANSFER_LINE_REQUEST';
export const POST_BED_TRANSFER_LINE_SUCCESS = 'POST_BED_TRANSFER_LINE_SUCCESS';
export const POST_BED_TRANSFER_LINE_FAILURE = 'POST_BED_TRANSFER_LINE_FAILURE';

export const POST_SAVE_BED_TRANSFER_LINE_REQUEST = 'POST_SAVE_BED_TRANSFER_LINE_REQUEST';
export const POST_SAVE_BED_TRANSFER_LINE_SUCCESS = 'POST_SAVE_BED_TRANSFER_LINE_SUCCESS';
export const POST_SAVE_BED_TRANSFER_LINE_FAILURE = 'POST_SAVE_BED_TRANSFER_LINE_FAILURE';

export const GET_QY_BED_TRANSFER_LINES_REQUEST = 'GET_QY_BED_TRANSFER_LINES_REQUEST';
export const GET_QY_BED_TRANSFER_LINES_SUCCESS = 'GET_QY_BED_TRANSFER_LINES_SUCCESS';
export const GET_QY_BED_TRANSFER_LINES_FAILURE = 'GET_QY_BED_TRANSFER_LINES_FAILURE';

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
            payload: error.response?.data?.errors || error.message,
        });

        return { type: POST_RELEASE_BED_FAILURE, payload: error };
    }
};

export const postBedTransferLineSlice = (bedTransferData) => 
    async (dispatch, getState) => {
      const config = configHelpers(getState);
      try {
          dispatch({ type: POST_BED_TRANSFER_LINE_REQUEST });
  
  
          const { data } = await axios.post(`${API_URL}/Inpatient/BedTransferLine`, bedTransferData, config);
      
  
          dispatch({ type: POST_BED_TRANSFER_LINE_SUCCESS, payload: data });
  
          return { type: POST_BED_TRANSFER_LINE_SUCCESS, payload: data };
  
      } catch (error) {
      
          dispatch({
              type: POST_BED_TRANSFER_LINE_FAILURE,
              payload: error.response?.data?.errors || error.message,
          });
  
          return { type: POST_BED_TRANSFER_LINE_FAILURE, payload: error };
      }
  };

  export const postSaveBedTransferLineSlice = (bedTransferData) => 
    async (dispatch, getState) => {
      const config = configHelpers(getState);
      try {
          dispatch({ type: POST_SAVE_BED_TRANSFER_LINE_REQUEST });
  
  
          const { data } = await axios.post(`${API_URL}/Inpatient/PostBedTransferLine`, bedTransferData, config);
      
  
          dispatch({ type: POST_SAVE_BED_TRANSFER_LINE_SUCCESS, payload: data });
  
          return { type: POST_SAVE_BED_TRANSFER_LINE_SUCCESS, payload: data };
  
      } catch (error) {
      
          dispatch({
              type: POST_SAVE_BED_TRANSFER_LINE_FAILURE,
              payload: error.response?.data?.errors || error.message,
          });
  
          return { type: POST_SAVE_BED_TRANSFER_LINE_FAILURE, payload: error };
      }
  };

  export const getQyBedTransferLines = (admissionNo) => 
    async (dispatch, getState) => {
      const config = configHelpers(getState);
      try {
          dispatch({ type: GET_QY_BED_TRANSFER_LINES_REQUEST });
  
  
          const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=QyBedTransferLines&isList=true&query=$filter=AdmissionNo eq '${admissionNo}'`, config);
      
        console.log('response from API', data)
          dispatch({ type: GET_QY_BED_TRANSFER_LINES_SUCCESS, payload: data });
  
          return { type: GET_QY_BED_TRANSFER_LINES_SUCCESS, payload: data };
  
      } catch (error) {
      
          dispatch({
              type: GET_QY_BED_TRANSFER_LINES_FAILURE,
              payload: error.response?.data?.errors || error.message,
          });
  
          return { type: GET_QY_BED_TRANSFER_LINES_FAILURE, payload: error };
      }
  };


