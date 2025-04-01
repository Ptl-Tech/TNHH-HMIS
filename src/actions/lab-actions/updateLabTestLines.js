import axios from "axios";
import apiHeaderConfig from "../configHelpers";

export const POST_LAB_TEST_LINES_UPDATE_FAIL =
  "POST_LAB_TEST_LINES_UPDATE_FAIL";
export const POST_LAB_TEST_LINES_UPDATE_RESET =
  "POST_LAB_TEST_LINES_UPDATE_RESET";
export const POST_LAB_TEST_LINES_UPDATE_REQUEST =
  "POST_LAB_TEST_LINES_UPDATE_REQUEST";
export const POST_LAB_TEST_LINES_UPDATE_SUCCESS =
  "POST_LAB_TEST_LINES_UPDATE_SUCCESS";

const API_URL =
  import.meta.env.VITE_PORTAL_API_BASE_URL ||
  "https://chiromo.potestastechnologies.net:8085";

const transformLabTestLine = ({
  myAction,
  laboratoryNo,
  recId,
  labTestCode,
  specimenCode,
  unitOfMeasure,
}) => {
  return {
    recId,
    remarks: "",
    myAction,
    positive: false,
    laboratoryNo,
    labTestCode,
    specimenCode,
    unitOfMeasure,
    countValue: 0,
  };
};

const processLabTestLines = async (lines, config) => {
  const requests = lines.map(async (testLine) => {
    const finalTestLine = transformLabTestLine(testLine);
    console.log({ finalTestLine });

    const response = await axios.post(
      `${API_URL}/Laboratory/LabTestLine`,
      finalTestLine,
      config
    );

    if (response.status === "error")
      throw new Error(`Failed to process result for test line ${testLine}`);
  });

  await Promise.all(requests);
  return { status: "success" };
};

export const updateLabTestLines = (lines) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_LAB_TEST_LINES_UPDATE_REQUEST });

    const config = apiHeaderConfig(getState);

    const data = await processLabTestLines(lines, config);

    dispatch({ type: POST_LAB_TEST_LINES_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    console.log({ error });

    dispatch({
      type: POST_LAB_TEST_LINES_UPDATE_FAIL,
      payload: error.message,
      status: error.response?.status || "Network Error",
      data: error.response?.data || null,
    });
  }
};
