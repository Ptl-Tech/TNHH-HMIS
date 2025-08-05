import axios from "axios";

const API = `${import.meta.env.VITE_PORTAL_API_BASE_URL}/`;

// Action Types
export const POST_PRESCRIPTION_FAIL = "POST_PRESCRIPTION_FAIL";
export const POST_PRESCRIPTION_RESET = "POST_PRESCRIPTION_RESET";
export const POST_PRESCRIPTION_REQUEST = "POST_PRESCRIPTION_REQUEST";
export const POST_PRESCRIPTION_SUCCESS = "POST_PRESCRIPTION_SUCCESS";

export const POST_PRESCRIPTION_TO_PHARMACY_REQUEST =
  "POST_PRESCRIPTION_TO_PHARMACY_REQUEST";
export const POST_PRESCRIPTION_TO_PHARMACY_SUCCESS =
  "POST_PRESCRIPTION_TO_PHARMACY_SUCCESS";
export const POST_PRESCRIPTION_TO_PHARMACY_FAIL =
  "POST_PRESCRIPTION_TO_PHARMACY_FAIL";
export const POST_PRESCRIPTION_TO_PHARMACY_RESET =
  "POST_PRESCRIPTION_TO_PHARMACY_RESET";

export const POST_INPATIENT_PRESCRIPTION_REQUEST =
  "POST_INPATIENT_PRESCRIPTION_REQUEST";
export const POST_INPATIENT_PRESCRIPTION_SUCCESS =
  "POST_INPATIENT_PRESCRIPTION_SUCCESS";
export const POST_INPATIENT_PRESCRIPTION_FAIL =
  "POST_INPATIENT_PRESCRIPTION_FAIL";
export const POST_INPATIENT_PRESCRIPTION_RESET =
  "POST_INPATIENT_PRESCRIPTION_RESET";

export const POST_INPATIENT_PRESCRIPTION_TO_PHARMACY_REQUEST =
  "POST_INPATIENT_PRESCRIPTION_TO_PHARMACY_REQUEST";
export const POST_INPATIENT_PRESCRIPTION_TO_PHARMACY_SUCCESS =
  "POST_INPATIENT_PRESCRIPTION_TO_PHARMACY_SUCCESS";
export const POST_INPATIENT_PRESCRIPTION_TO_PHARMACY_FAIL =
  "POST_INPATIENT_PRESCRIPTION_TO_PHARMACY_FAIL";
export const POST_INPATIENT_PRESCRIPTION_TO_PHARMACY_RESET =
  "POST_INPATIENT_PRESCRIPTION_TO_PHARMACY_RESET";

// Post Prescription Action
export const postPrescriptionDetails =
  (prescriptions) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_PRESCRIPTION_REQUEST });

      const {
        auth: { user }
      } = getState();
      const branchCode = user.branchCode;

      const config = {
        headers: {
          "Content-Type": "application/json",
          staffNo: user.staffNo,
          
          branchCode: branchCode,
        },
      };

      const resposes = prescriptions.map(async (prescription) => {
        const response = await axios.post(
          `${API}Doctor/PatientPrescriptions`,
          prescription,
          config
        );

        if (response.data.status === "error")
          throw new Error(`Could not add ${prescription.Description} drug`);

        return response.data;
      });

      await Promise.all(resposes);
      const responseData = { status: "success", data: { status: "success" } };

      dispatch({ type: POST_PRESCRIPTION_SUCCESS, payload: responseData });
    } catch (error) {
      setTimeout(() => {
        dispatch({
          type: POST_PRESCRIPTION_FAIL,
          payload:
            error.message ||
            error.response?.data?.message ||
            error.errors ||
            "Something went wrong, check your network",
        });
      }, 1200);

      throw error; // Rethrow error for handling in the component
    }
  };

export const postInPatientPrescriptionDetails =
  (prescriptions) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_INPATIENT_PRESCRIPTION_REQUEST });

      const {
        auth: { user }
      } = getState();
      const branchCode = user.branchCode;

      const config = {
        headers: {
          "Content-Type": "application/json",
          staffNo: user.staffNo,
          
          branchCode: branchCode,
        },
      };

      const resposes = prescriptions.map(async (prescription) => {
        const response = await axios.post(
          `${API}Inpatient/DrugPrescription`,
          prescription,
          config
        );

        if (response.data.status === "error")
          throw new Error(`Could not add ${prescription.Description} drug`);

        return response.data;
      });

      await Promise.all(resposes);
      const responseData = { status: "success", data: { status: "success" } };

      dispatch({
        type: POST_INPATIENT_PRESCRIPTION_SUCCESS,
        payload: responseData,
      });
    } catch (error) {
      setTimeout(() => {
        dispatch({
          type: POST_INPATIENT_PRESCRIPTION_FAIL,
          payload:
            error.message || error.response?.data?.message || error.errors,
        });
      }, 1200);

      throw error; // Rethrow error for handling in the component
    }
  };

export const sendtoPharmacy = (treatmentId) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_PRESCRIPTION_TO_PHARMACY_REQUEST });

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

    // Corrected request body structure
    const response = await axios.post(
      `${API}Doctor/PrescribeDrugs`,
      {
        treatmentNo: treatmentId, // Send treatmentNo as part of the request body
      },
      config
    );

    // Extract response details
    const responseData = {
      status: response.data.status,
      data: response.data, // Assuming `msg` contains the patient ID
    };

    dispatch({
      type: POST_PRESCRIPTION_TO_PHARMACY_SUCCESS,
      payload: responseData,
    });
  } catch (error) {
    setTimeout(() => {
      dispatch({
        type: POST_PRESCRIPTION_TO_PHARMACY_FAIL,
        payload: error.response?.data?.message || error.errors,
      });
    }, 1200);
    throw error; // Rethrow error for `handleSubmit` to handle
  }
};

export const InpatientSendToPharmacy =
  (treatmentId) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_INPATIENT_PRESCRIPTION_TO_PHARMACY_REQUEST });

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

      // Corrected request body structure
      const response = await axios.post(
        `${API}Inpatient/PostDrugPrescriptions`,
        { admissionNo: treatmentId }, // Send treatmentNo as part of the request body
        config
      );

      console.log("response from API:", response);

      // Check if the API response indicates an error
      if (!response.data.status) {
        throw new Error(response.data.message || "Unexpected error occurred");
      }

      const responseData = {
        status: response.data.status,
        data: response.data,
      };

      dispatch({
        type: POST_INPATIENT_PRESCRIPTION_TO_PHARMACY_SUCCESS,
        payload: responseData,
      });
    } catch (error) {
      console.error("Error:", error);

      dispatch({
        type: POST_INPATIENT_PRESCRIPTION_TO_PHARMACY_FAIL,
        payload: error.response?.data?.message || error.message,
      });
      throw error; // Rethrow to allow further handling
    }
  };
