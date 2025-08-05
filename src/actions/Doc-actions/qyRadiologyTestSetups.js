import axios from "axios";
import { message } from "antd"; // Import message for error handling

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;


export const QY_RADIOLOGY_TEST_LIST_REQUEST = "QY_RADIOLOGY_TEST_LIST_REQUEST";
export const QY_RADIOLOGY_TEST_LIST_SUCCESS = "QY_RADIOLOGY_TEST_LIST_SUCCESS";
export const QY_RADIOLOGY_TEST_LIST_FAIL = "QY_RADIOLOGY_TEST_LIST_FAIL";


export const getRadiologySetup = () => async (dispatch, getState) => {
    try {
        dispatch({ type: QY_RADIOLOGY_TEST_LIST_REQUEST });

        const {
            auth: { user }
        } = getState();
        const branchCode = user.branchCode;

        const config = {
            headers: {
                "Content-Type": "application/json",
                staffNo: user.staffNo, // Add staffNo as a custom header
                 // Add sessionToken as a Bearer token
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
