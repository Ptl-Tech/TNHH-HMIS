import axios from "axios";
import { message } from "antd";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

// Action Types
export const GET_SINGLE_DISCHARGE_REQUEST_FAIL =
  "GET_SINGLE_DISCHARGE_REQUEST_FAIL";
export const GET_SINGLE_DISCHARGE_REQUEST_RESET =
  "GET_SINGLE_DISCHARGE_REQUEST_RESET";
export const GET_SINGLE_DISCHARGE_REQUEST_REQUEST =
  "GET_SINGLE_DISCHARGE_REQUEST_REQUEST";
export const GET_SINGLE_DISCHARGE_REQUEST_SUCCESS =
  "GET_SINGLE_DISCHARGE_REQUEST_SUCCESS";

// Action to fetch single patient
export const getSingleDischargeRequest =
  (admnNo) => async (dispatch, getState) => {
    if (!admnNo) return;

    try {
      dispatch({ type: GET_SINGLE_DISCHARGE_REQUEST_REQUEST });

      const {
        auth: { user }
      } = getState();

      
      const branchCode = user.branchCode || "";

      // Set up the request configuration with headers
      const config = {
        headers: {
          "Content-Type": "application/json",
          staffNo: user.staffNo,
         
          branchCode,
        },
      };

      // API request
      const { data } = await axios.get(
        `${API}data/odatafilter?webservice=QyDischargeHeaderList&isList=false&query=$filter=Admission_No eq '${admnNo}'`,
        config
      );

      // Dispatch success action with the fetched data
      dispatch({
        type: GET_SINGLE_DISCHARGE_REQUEST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.error({ error });

      // Extract and handle errors properly
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";

      dispatch({
        type: GET_SINGLE_DISCHARGE_REQUEST_FAIL,
        payload: errorMessage,
      });

      message.error(errorMessage, 5); // Display the error message to the user

      throw error; // Rethrow the error if needed
    }
  };
