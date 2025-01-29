import { message } from 'antd';
import configHelpers from '../configHelpers';
import axios from "axios";

export const POST_NURSING_CARE_PLAN_REQUEST = 'POST_NURSING_CARE_PLAN_REQUEST';
export const POST_NURSING_CARE_PLAN_SUCCESS = 'POST_NURSING_CARE_PLAN_SUCCESS';
export const POST_NURSING_CARE_PLAN_FAILURE = 'POST_NURSING_CARE_PLAN_FAILURE';


export const GET_NURSING_CARE_PLAN_REQUEST = 'GET_NURSING_CARE_PLAN_REQUEST';
export const GET_NURSING_CARE_PLAN_SUCCESS = 'GET_NURSING_CARE_PLAN_SUCCESS';
export const GET_NURSING_CARE_PLAN_FAILURE = 'GET_NURSING_CARE_PLAN_FAILURE';


const API_URL = import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

export const postNursingCarePlanSlice = (formData) => 
  async (dispatch, getState) => {
    const config = configHelpers(getState);
    try {
        dispatch({ type: POST_NURSING_CARE_PLAN_REQUEST });

        const { data } = await axios.post(`${API_URL}/InpatientForms/NursingCarePlanForm`, formData, config);
    

        dispatch({ type: POST_NURSING_CARE_PLAN_SUCCESS, payload: data });

        return { type: POST_NURSING_CARE_PLAN_SUCCESS, payload: data };

    } catch (error) {
    
        dispatch({
            type: POST_NURSING_CARE_PLAN_FAILURE,
            payload: error.response?.data?.message || error.message,
        });
        
        message.error(error.message, 5);
        return { type: POST_NURSING_CARE_PLAN_FAILURE, payload: error };
    }
};


export const getNursingCarePlanSlice = () => 
    async (dispatch, getState) => {
      const config = configHelpers(getState);
      try {
          dispatch({ type: GET_NURSING_CARE_PLAN_REQUEST });
  
          const { data } = await axios.get(`${API_URL}/data/odatafilter?webservice=PgNursingCarePlan&isList=true`, config);
      
  
          dispatch({ type: GET_NURSING_CARE_PLAN_SUCCESS, payload: data });
  
          return { type: GET_NURSING_CARE_PLAN_SUCCESS, payload: data };
  
      } catch (error) {
      
          dispatch({
              type: GET_NURSING_CARE_PLAN_FAILURE,
              payload: error.response?.data?.message || error.message,
          });
  
          message.error(error.message, 5);
          return { type: GET_NURSING_CARE_PLAN_FAILURE, payload: error };
      }
  };
