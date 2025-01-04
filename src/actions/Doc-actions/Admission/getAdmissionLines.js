import axios from "axios";
import { message } from "antd"; // Import Ant Design message for error handling

const API = "http://217.21.122.62:8085/";

export const REQUEST_ADMISSION_LINES = "REQUEST_ADMISSION_LINES";
export const REQUEST_ADMISSION_LINES_SUCCESS = "REQUEST_ADMISSION_LINES_SUCCESS";
export const REQUEST_ADMISSION_LINES_FAIL = "REQUEST_ADMISSION_LINES_FAIL";
export const REQUEST_ADMISSION_LINES_RESET = "REQUEST_ADMISSION_LINES_RESET";

export const getAdmissionLines = (treatmentId) => async (dispatch, getState) => {
    try {
      dispatch({ type: REQUEST_ADMISSION_LINES });
  
      const {
        otpVerify: { userInfo },
      } = getState();
      const branchCode = localStorage.getItem("branchCode");
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          staffNo: userInfo.userData.no,
          sessionToken: userInfo.userData.portalSessionToken,
          branchCode: branchCode,
        },
      };
  
      const response = await axios.get(
        `${API}data/odatafilter?webservice=QyTreatmentAdmissionLines&isList=false&query=$filter=TreatmentNo eq '${treatmentId}'`,
        config
      );
  
      dispatch({ type: REQUEST_ADMISSION_LINES_SUCCESS, payload: response.data });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch radiology test data";
      dispatch({ type: REQUEST_ADMISSION_LINES_FAIL, payload: errorMessage });
    }
  };
  