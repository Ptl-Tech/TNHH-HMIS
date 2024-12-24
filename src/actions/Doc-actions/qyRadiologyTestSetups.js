import axios from "axios";
import { message } from "antd"; // Import message for error handling

const API = "http://217.21.122.62:8085/";


export const RADIOLOGY_TEST_SETUP_REQUEST = "RADIOLOGY_TEST_SETUP_REQUEST";
export const RADIOLOGY_TEST_SETUP_SUCCESS = "RADIOLOGY_TEST_SETUP_SUCCESS";
export const RADIOLOGY_TEST_SETUP_FAIL = "RADIOLOGY_TEST_SETUP_FAIL";


export const getRadiologySetup = () => async (dispatch, getState) => {
    try {
        dispatch({ type: RADIOLOGY_TEST_SETUP_REQUEST });

        const {
            otpVerify: { userInfo },
        } = getState();
        const branchCode = localStorage.getItem("branchCode");

        const config = {
            headers: {
                "Content-Type": "application/json",
                staffNo: userInfo.userData.no, // Add staffNo as a custom header
                sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
                branchCode: branchCode,
            },
        };

        // Make the GET request
        const { data } = await axios.get(
            `${API}data/odatafilter?webservice=QyRadiologyTypesSetup`,
            config
        );

        // Dispatch success action with received data
        dispatch({ type: RADIOLOGY_TEST_SETUP_SUCCESS, payload: data });
    } catch (error) {
        // Dispatch fail action and show error message
        dispatch({
            type: RADIOLOGY_TEST_SETUP_FAIL,
            payload: error.response?.data?.message || error.message,
        });

        message.error(error.response?.data?.message || error.message, 5);
        
        throw error; // Rethrow error for further handling if necessary
    }
};
