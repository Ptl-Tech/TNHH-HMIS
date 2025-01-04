import { GET_SAMPLE_SETUP_REQUEST, GET_SAMPLE_SETUP_SUCCESS, GET_SAMPLE_SETUP_FAILURE, GET_SAMPLE_SETUP_RESET } from "../../actions/Doc-actions/getSampleCollectionSetup";

export const QySpecimenSampleSetupReducer = (state = { specimens: [] }, action) => {
  switch (action.type) {
    case GET_SAMPLE_SETUP_REQUEST:
      return { loading: true, specimens: [] };
    case GET_SAMPLE_SETUP_SUCCESS:
      return { loading: false, specimens: action.payload };
    case GET_SAMPLE_SETUP_FAILURE:
      return { loading: false, error: action.payload };
    case GET_SAMPLE_SETUP_RESET:
      return { specimens: [] };
    default:
      return state;
  }
}
