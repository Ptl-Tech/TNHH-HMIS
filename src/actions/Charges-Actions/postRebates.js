import { message } from "antd";
import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const POST_REBATES_REQUEST = "POST_REBATES_REQUEST";
export const POST_REBATES_SUCCESS = "POST_REBATES_SUCCESS";
export const POST_REBATES_FAIL = "POST_REBATES_FAIL";
export const POST_REBATES_RESET = "POST_REBATES_RESET";

export const postRebates =
  (rebatesData) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_REBATES_REQUEST });

     
      const {
        auth: { user }
      } = getState();
      const branchCode = user.branchCode;

      // Set headers for the request
      const config = {
        headers: {
          "Content-Type": "application/json",
          staffNo: user.staffNo,
          
          branchCode: branchCode,
        },
      };

      // Make the POST request to the server
      const response = await axios.post(
        `${API}GeneralProcesses/SHIFRebatesCalculation`,
        rebatesData,
        config
      );
console.log("status78", response.data.status);
      // Extract and validate the response data
      dispatch({
        type: POST_REBATES_SUCCESS,
        payload: response.data.status,
      });
      message.success(`Patient Rebates allocated: ${response.data.status}fully`);
    } catch (error) {
        console.error(error);
      // Dispatch failure action
      dispatch({
        type: POST_REBATES_FAIL,
        payload: error.response?.data?.errors ,
      });

      // Display error message
      message.error(error.response?.data?.errors );

      // Rethrow error for handling by other parts of the app
      throw error;
    }
  };
