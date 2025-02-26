import axios from 'axios';
import apiHeaderConfig from '../configHelpers';

export const POST_LAB_TEST_LINES_FAIL = 'POST_LAB_TEST_LINES_FAIL';
export const POST_LAB_TEST_LINES_RESET = 'POST_LAB_TEST_LINES_RESET';
export const POST_LAB_TEST_LINES_REQUEST = 'POST_LAB_TEST_LINES_REQUEST';
export const POST_LAB_TEST_LINES_SUCCESS = 'POST_LAB_TEST_LINES_SUCCESS';

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL ||
  'https://chiromo.potestastechnologies.net:8085';

const transformLabTestLine = (
  laboratoryNo,
  { labTestCode, specimenCode, unitOfMeasure },
) => {
  return {
    remarks: '',
    myAction: 'create',
    positive: false,
    laboratoryNo,
    labTestCode,
    specimenCode,
    unitOfMeasure,
    countValue: 0,
  };
};

const processLabTestLines = async (laboratoryNo, testLines, config) => {
  const requests = testLines.map(async (testLine) => {
    const finalTestLine = transformLabTestLine(laboratoryNo, testLine);

    console.log({ finalTestLine });

    const response = await axios.post(
      `${API_URL}/Laboratory/LabTestLine`,
      finalTestLine,
      config,
    );

    if (response.status === 'error')
      throw new Error(`Failed to process result for test line ${testLine}`);
  });

  await Promise.all(requests);
  return { status: 'success' };
};

export const postLabTestLines =
  (laboratoryNo, testLines) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_LAB_TEST_LINES_REQUEST });

      const config = apiHeaderConfig(getState);

      const data = await processLabTestLines(laboratoryNo, testLines, config);

      dispatch({ type: POST_LAB_TEST_LINES_SUCCESS, payload: data });
    } catch (error) {
      console.log({ error });

      dispatch({
        type: POST_LAB_TEST_LINES_FAIL,
        payload: error.message,
        status: error.response?.status || 'Network Error',
        data: error.response?.data || null,
      });
    }
  };
