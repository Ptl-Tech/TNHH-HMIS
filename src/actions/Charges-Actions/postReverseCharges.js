import { message } from "antd";
import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

export const POST_REVERSE_CHARGES_REQUEST = "POST_REVERSE_CHARGES_REQUEST";
export const POST_REVERSE_CHARGES_SUCCESS = "POST_REVERSE_CHARGES_SUCCESS";
export const POST_REVERSE_CHARGES_FAIL = "POST_REVERSE_CHARGES_FAIL";
export const POST_REVERSE_CHARGES_RESET = "POST_REVERSE_CHARGES_RESET";

export const postReverseCharges =
  (receiptRec) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_REVERSE_CHARGES_REQUEST });

      const { auth } = getState();

      const { user } = auth;
      const branchCode = user.branchCode;

      // Set headers for the request
      const config = {
        headers: {
          "Content-Type": "application/json",
          staffNo: user.staffNo,
          branchCode: branchCode || "", // Ensure branchCode doesn't cause errors
        },
      };

      // Make the POST request to the server
      const response = await axios.post(
        `${API}GeneralProcesses/ReversePatientCharge`,
        receiptRec,
        config
      );

      // Extract and validate the response data
      const { status, ReceiptId, msg } = response.data;

      if (status === "success" && ReceiptId) {
        dispatch({
          type: POST_REVERSE_CHARGES_SUCCESS,
          payload: { status, ReceiptId },
        });

        message.success(
          `Charges reversed successfully. Receipt ID: ${ReceiptId}`
        );

        return { status, ReceiptId };
      } else {
        throw new Error(msg || "Failed to reverse charges.");
      }
    } catch (error) {
      // Extract error response data safely
      const errorMessage =
        error.response?.data?.msg ||
        error.message ||
        "An unexpected error occurred.";

      dispatch({
        type: POST_REVERSE_CHARGES_FAIL,
        payload: errorMessage,
      });

      message.error(errorMessage);

      throw error;
    }
  };
