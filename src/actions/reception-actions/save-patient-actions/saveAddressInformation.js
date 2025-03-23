import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://chiromo.potestastechnologies.net:8085/";

export const SAVE_ADDRESS_INFORMATION_REQUEST =
    "SAVE_ADDRESS_INFORMATION_REQUEST";
export const SAVE_ADDRESS_INFORMATION_SUCCESS =
    "SAVE_ADDRESS_INFORMATION_SUCCESS";
export const SAVE_ADDRESS_INFORMATION_FAIL = "SAVE_ADDRESS_INFORMATION_FAIL";
export const SAVE_ADDRESS_INFORMATION_RESET = "SAVE_ADDRESS_INFORMATION_RESET";

export const saveAddressInformation = (addressData) => async (dispatch, getState) => {
    try {
        dispatch({ type: SAVE_ADDRESS_INFORMATION_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        if (!userInfo || !userInfo.userData) {
            navigate("/login"); // Redirect to login
            throw new Error("User information not available.");
        }

        const branchCode = localStorage.getItem("branchCode");

        const config = {
            headers: {
                "Content-Type": "application/json",
                staffNo: userInfo.userData.no, // Staff number
                sessionToken: userInfo.userData.portalSessionToken, // Session token
                branchCode: branchCode, // Branch Code
            },
        };

        const formattedData = {
            ...addressData,
            branchCode: branchCode,
        };

        const response = await axios.post(
            `${API}Reception/PatientRegistration`,
            formattedData,
            config
        );

        dispatch({ type: SAVE_ADDRESS_INFORMATION_SUCCESS, payload: response.data });

        return response.data;
    } catch (error) {
        dispatch({ type: SAVE_ADDRESS_INFORMATION_FAIL, payload: error.response?.data?.errors });
        throw error;
    }
};