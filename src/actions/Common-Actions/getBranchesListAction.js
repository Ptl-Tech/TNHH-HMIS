import axios from "axios";
import { message } from "antd";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

// Action Types
export const GET_BRANCHES_LIST_REQUEST = "GET_BRANCHES_LIST_REQUEST";
export const GET_BRANCHES_LIST_SUCCESS = "GET_BRANCHES_LIST_SUCCESS";
export const GET_BRANCHES_LIST_FAIL = "GET_BRANCHES_LIST_FAIL";
export const GET_BRANCHES_LIST_RESET = "GET_BRANCHES_LIST_RESET";

export const QyBranchesList = () => async (dispatch, getState) => {
  var query = `${API}data/odatafilter?webservice=QyDimensionValues&isList=true&query=$filter=DimensionCode eq 'BRANCH'`;

  try {
    dispatch({ type: GET_BRANCHES_LIST_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();

    // Retrieve branch code from localStorage or fallback to empty string
    const branchCode = localStorage.getItem("branchCode") || "";

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo?.userData?.no || "",
        sessionToken: userInfo?.userData?.portalSessionToken || "",
        branchCode,
      },
    };

    const { data } = await axios.get(query, config);

    dispatch({
      type: GET_BRANCHES_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log({ error });

    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";

    dispatch({
      type: GET_BRANCHES_LIST_FAIL,
      payload: errorMessage,
    });

    message.error(errorMessage, 5);
    throw error;
  }
};
