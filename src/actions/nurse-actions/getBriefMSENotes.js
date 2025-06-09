import axios from 'axios';

const API = 'https://chiromo.potestastechnologies.net:8085/';

export const GET_NURSE_BRIEF_MSE_FORM_REQUEST = 'GET_NURSE_BRIEF_MSE_FORM_REQUEST';
export const GET_NURSE_BRIEF_MSE_FORM_SUCCESS = 'GET_NURSE_BRIEF_MSE_FORM_SUCCESS';
export const GET_NURSE_BRIEF_MSE_FORM_FAIL = 'GET_NURSE_BRIEF_MSE_FORM_FAIL';
export const GET_NURSE_BRIEF_MSE_FORM_RESET = 'GET_NURSE_BRIEF_MSE_FORM_RESET';

export const getNurseBriefMSEData =
  ({ patientNo }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: GET_NURSE_BRIEF_MSE_FORM_REQUEST });

      const {
        otpVerify: { userInfo },
      } = getState();

      const branchCode = localStorage.getItem('branchCode');

      const config = {
        headers: {
          'Content-Type': 'application/json',
          staffNo: userInfo.userData.no,
          sessionToken: userInfo.userData.portalSessionToken,
          branchCode,
        },
      };

      const { data } = await axios.get(
        `${API}InpatientForms/GetBriefMSEForm?patientNo=${patientNo}`,
        config
      );

      const result = {
        sections: data.formSections || [],
        sectionCategories: data.formCategories || [],
        formItems: data.formItems || [],
      };

      dispatch({ type: GET_NURSE_BRIEF_MSE_FORM_SUCCESS, payload: result });
    } catch (error) {
      console.error('Fetch MSE form error:', error);
      dispatch({
        type: GET_NURSE_BRIEF_MSE_FORM_FAIL,
        payload: error?.response?.data?.message || error.message,
      });
    }
  };
