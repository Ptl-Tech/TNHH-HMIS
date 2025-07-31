import axios from "axios";
import { message } from "antd"; // Import Ant Design message for error handling

const API = "https://chiromo.potestastechnologies.net:8091/";

export const GET_PHARMACY_REQUESTS_ALL = "GET_PHARMACY_REQUESTS_ALL";
export const GET_PHARMACY_REQUESTS_ALL_SUCCESS =
  "GET_PHARMACY_REQUESTS_ALL_SUCCESS";
export const GET_PHARMACY_REQUESTS_ALL_FAILURE =
  "GET_PHARMACY_REQUESTS_ALL_FAILURE";
export const GET_PHARMACY_REQUESTS_ALL_RESET =
  "GET_PHARMACY_REQUESTS_ALL_RESET";

const generateQuery = ({ type, status, branchCode, dateRange }) => {
  var query = `&query=$filter=Global_Dimension1 eq '${branchCode}'`;

  switch (type) {
    case "WalkIn":
      query += " and Walkin eq true";
      break;
    case "InPatient":
      query += " and InPatient eq true";
      break;
    case "OutPatient":
      query += " and InPatient eq false and Walkin eq false";
      break;
    default:
      break;
  }

  switch (status) {
    case "New":
      query += " and Status eq 'New'";
      break;
    case "Forwarded":
      query += " and Status eq 'Forwarded'";
      break;
    case "Completed":
      query += " and Status eq 'Completed'";
      break;
    case "Cancelled":
      query += " and Status eq 'Cancelled'";
      break;
    default:
      break;
  }

  query += ` and Pharmacy_Date ge ${dateRange.from} and Pharmacy_Date le ${dateRange.to}`;

  return query;
};

export const getPharmacyRequestsAll =
  ({ type, status, dateRange }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: GET_PHARMACY_REQUESTS_ALL });

      const {
        otpVerify: { userInfo },
      } = getState();
      const branchCode = localStorage.getItem("branchCode");

      const config = {
        headers: {
          "Content-Type": "application/json",
          staffNo: userInfo?.userData?.no,
          sessionToken: userInfo?.userData?.portalSessionToken,
          branchCode: branchCode,
        },
      };

      const query = generateQuery({ type, status, branchCode, dateRange });
      const response = await axios.get(
        `${API}data/odatafilter?webservice=QyPharmacyList&isList=true${query}`,

        config
      );

      console.log({ response });

      if (response.data === "") {
        return message.error(
          "The requested pharmacy header could not be found"
        );
      }
      dispatch({
        type: GET_PHARMACY_REQUESTS_ALL_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch diagnosis lines";

      // Display error message using Ant Design's message component
      message.error(errorMessage);

      dispatch({
        type: GET_PHARMACY_REQUESTS_ALL_FAILURE,
        payload: errorMessage,
      });
    }
  };
