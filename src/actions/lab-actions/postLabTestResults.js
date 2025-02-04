import axios from 'axios';
import apiHeaderConfig from '../configHelpers';

export const POST_LAB_TEST_RESULTS_FAIL = 'POST_LAB_TEST_RESULTS_FAIL';
export const POST_LAB_TEST_RESULTS_REQUEST = 'POST_LAB_TEST_RESULTS_REQUEST';
export const POST_LAB_TEST_RESULTS_SUCCESS = 'POST_LAB_TEST_RESULTS_SUCCESS';

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://217.21.122.62:8085';

const transformLabResult = (result) => {
  const {
    SystemId,
    Laboratory_No,
    Laboratory_Test_Code,
    Specimen_Code,
    Reactive,
    Positive,
    Results,
    Remarks,
    Measuring_Unit_Code,
    flag,
  } = result;

  const flagMap = {
    Normal: 0,
    High: 1,
    Low: 2,
  };

  return {
    myAction: 'edit',
    recId: SystemId,
    laboratoryNo: Laboratory_No,
    labTestCode: Laboratory_Test_Code,
    specimenCode: Specimen_Code,
    results: Results,
    positive: Positive,
    testUnits: Measuring_Unit_Code,
    flag: flagMap[flag] ?? 0,
    reactive: parseInt(Reactive),
    remarks: Remarks,
  };
};

const processLabResults = async (results, config) => {
  const requests = results
    .filter((result) => result.Specimen_Code)
    .map(async (result) => {
      const finalResult = transformLabResult(result);

      const response = await axios.post(
        `${API_URL}/Laboratory/LabTestResultsEntry`,
        finalResult,
        config,
      );

      if (response.data.status === 'error') {
        throw new Error(
          `Failed to process result for specimen ${finalResult.specimenCode}: ${response.data.message}`,
        );
      }

      return response.data;
    });

  await Promise.all(requests);
  return { status: 'success' };
};

export const postLabTestResults = (results) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_LAB_TEST_RESULTS_REQUEST });

    const config = apiHeaderConfig(getState);
    const data = await processLabResults(results, config);

    dispatch({
      type: POST_LAB_TEST_RESULTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error('Lab results submission error:', error);

    dispatch({
      type: POST_LAB_TEST_RESULTS_FAIL,
      payload: {
        message: error.message,
        status: error.response?.status || 'Network Error',
        data: error.response?.data || null,
      },
    });
  }
};
