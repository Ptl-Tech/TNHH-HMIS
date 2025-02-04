import axios from "axios";
import { message } from "antd"; // Import message for error handling

const API = "https://chiromo.potestastechnologies.net:8085/";


export const QY_RADIOLOGY_TEST_LIST_REQUEST = "QY_RADIOLOGY_TEST_LIST_REQUEST";
export const QY_RADIOLOGY_TEST_LIST_SUCCESS = "QY_RADIOLOGY_TEST_LIST_SUCCESS";
export const QY_RADIOLOGY_TEST_LIST_FAIL = "QY_RADIOLOGY_TEST_LIST_FAIL";


export const getRadiologySetup = () => async (dispatch, getState) => {
    try {
        dispatch({ type: QY_RADIOLOGY_TEST_LIST_REQUEST });

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
        dispatch({ type: QY_RADIOLOGY_TEST_LIST_SUCCESS, payload: data });
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
