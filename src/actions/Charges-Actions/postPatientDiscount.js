import { message } from "antd";
import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const POST_DISCOUNT_REQUEST = "POST_DISCOUNT_REQUEST";
export const POST_DISCOUNT_SUCCESS = "POST_DISCOUNT_SUCCESS";
export const POST_DISCOUNT_FAIL = "POST_DISCOUNT_FAIL";
export const POST_DISCOUNT_RESET = "POST_DISCOUNT_RESET";

export const postDiscount =
  (DiscountData) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_DISCOUNT_REQUEST });

     
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
        `${API}GeneralProcesses/DiscountCalculation `,
        DiscountData,
        config
      );

      // Extract and validate the response data
      dispatch({
        type: POST_DISCOUNT_SUCCESS,
        payload: response.data.status,
      });
      message.success(`Patient Discount allocated: ${response.data.status}fully`);
    } catch (error) {
        console.error(error);
      // Dispatch failure action
      dispatch({
        type: POST_DISCOUNT_FAIL,
        payload: error.response?.data?.errors ,
      });

      // Display error message
      message.error(error.response?.data?.errors);

      // Rethrow error for handling by other parts of the app
      throw error;
    }
  };
