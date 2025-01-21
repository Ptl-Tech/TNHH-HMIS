import axios from "axios";
import {
  PATIENT_REGISTER_FAIL,
  PATIENT_REGISTER_REQUEST,
  PATIENT_REGISTER_SUCCESS,
  TRIAGE_VISIT_FAIL,
  TRIAGE_VISIT_REQUEST,
  TRIAGE_VISIT_SUCCESS,
  PATIENT_LIST_REQUEST,
  PATIENT_LIST_SUCCESS,
  PATIENT_LIST_FAIL,
  PATIENT_LIST_RESET,
  TRIAGE_VISIT_LIST_REQUEST,
  TRIAGE_VISIT_LIST_SUCCESS,
  TRIAGE_VISIT_LIST_FAIL,
  POST_PATIENT_VITALS_REQUEST,
  POST_PATIENT_VITALS_SUCCESS,
  POST_PATIENT_VITALS_FAIL,
  POST_DOCTOR_TREATMENT_REQUEST,
  POST_DOCTOR_TREATMENT_SUCCESS,
  POST_DOCTOR_TREATMENT_FAIL,
  POST_TRIAGE_VISIT_REQUEST,
  POST_TRIAGE_VISIT_SUCCESS,
  POST_TRIAGE_VISIT_FAIL,
  ACTIVE_lIST_REQUEST,
  ACTIVE_LIST_SUCCESS,
  ACTIVE_LIST_FAIL,
  CONVERT_TO_PATIENT_REQUEST,
  CONVERT_TO_PATIENT_SUCCESS,
  CONVERT_TO_PATIENT_FAIL,
  APPMNT_LIST_REQUEST,
  APPMNT_LIST_SUCCESS,
  APPMNT_LIST_FAIL,
} from "../constants/patientConstants";
import { message } from "antd";
import useAuth from "../hooks/useAuth";

const API = "http://217.21.122.62:8085/";


export const createPatient = (patient) => async (dispatch, getState) => {
  try {
    dispatch({ type: PATIENT_REGISTER_REQUEST });

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

    console.log("patient: ", patient);

    const response = await axios.post(
      `${API}Reception/PatientRegistration`,
      patient,
      config
    );

    // Extract response details
    const responseData = {
      status: response.data.status,
      data: response.data, // Assuming `msg` contains the patient ID
    };

    setTimeout(() => {
      dispatch({ type: PATIENT_REGISTER_SUCCESS, payload: responseData });
      console.log("Dispatched Payload:", responseData);
    }, 2000);

    // Return patient ID for further use
    return responseData.data; // `msg` contains the patient ID
  } catch (error) {
    dispatch({
      type: PATIENT_REGISTER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    message.error(error.message, 5);
    throw error; // Rethrow error for `handleSubmit` to handle
  }
};

export const createTriageVisit = (visitData) => async (dispatch, getState) => {
  try {
    dispatch({ type: TRIAGE_VISIT_REQUEST });

    const {
      otpVerify: { userInfo },
  } = getState();
 // Fetch branchCode from localStorage
 const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
        branchCode: branchCode
      },
    };

    const { data } = await axios.post(
      `${API}Reception/CreateVisit`,
      visitData,
      config
    );

    // Extract response details, including appointment data
    const responseData = {
      status: data.status,
      appointmentNo: data.appointmentNo, // Assuming this is part of the response
      appointmentData: data.appointment, // The detailed appointment information
    };

    // Dispatch success action
    dispatch({ type: TRIAGE_VISIT_SUCCESS, payload: responseData });

    // Return appointment data for further use
    return responseData.appointmentData.appointmentNo; // Return the full appointment data
  } catch (error) {
    const errorMessage = error.response?.data?.errors || "An unexpected error occurred.";
    dispatch({ type: TRIAGE_VISIT_FAIL, payload: errorMessage });
    message.error(errorMessage); // Display the error message using Ant Design
  }
};


// export const postTriageVisit = (patient) => async (dispatch, getState) => {
//   try {
//     dispatch({ type: POST_TRIAGE_VISIT_REQUEST });

//     const {
//       otpVerify: { userInfo },
//   } = getState();
//  // Fetch branchCode from localStorage
//  const branchCode = localStorage.getItem("branchCode");

//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//         staffNo: userInfo.userData.no, // Add staffNo as a custom header
//         sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
//         branchCode: branchCode
//       },
//     };

//     const { data } = await axios.post(
//       `${API}Reception/DispatchToTriage`,
//       patient,
//       config
//     );

//     // // Extract response details, including appointment data
//     // const responseData = {
//     //   status: data.status,
//     //   appointmentNo: data.appointmentNo, // Assuming this is part of the response
//     //   appointmentData: data.appointment, // The detailed appointment information
//     // };

//     // Dispatch success action
//     dispatch({ type: POST_TRIAGE_VISIT_SUCCESS, payload: responseData });

//     // Return appointment data for further use
//     // return responseData.appointmentNo; // Return the full appointment data
//   } catch (error) {
//     dispatch({ type: POST_TRIAGE_VISIT_FAIL, payload: error.message });
//   }
// };

export const postTriageVisit = (appointmentId) => async (dispatch, getState) => {
  try {
    dispatch({ type:POST_TRIAGE_VISIT_REQUEST  });

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


    const response = await axios.post(
      `${API}Reception/DispatchToTriage`,
      { appointmentNo: appointmentId },
      config
    );

   // Extract response details
    const responseData = {
      status: response.data.status,
      msg: response.data.observationNo, // Assuming `msg` contains the patient ID
    };

    setTimeout(() => {
      console.log("Dispatched Payload:", responseData);
    }, 2000);

    dispatch({ type: POST_TRIAGE_VISIT_SUCCESS, payload: response });
    //message with success message and observationNo


  } catch (error) {
    dispatch({
      type: POST_TRIAGE_VISIT_FAIL,
      payload: error.response?.data?.message || error.errors,
    });
    // message.error(error.message, 5);
    throw error; // Rethrow error for `handleSubmit` to handle
  }
};

export const listPatients = () => async (dispatch, getState) => { 
  try {
    dispatch({ type: PATIENT_LIST_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();

    // Fetch branchCode from localStorage
    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
        branchCode: branchCode, // Include branchCode in headers
      },
    };

    const { data } = await axios.get(`${API}data/odatafilter?webservice=QyPatients`, config);

    // Filter the patients by branchCode matching GlobalDimension1Code
    const filteredData = data.filter((patient) => patient.GlobalDimension1Code === branchCode);
    

    dispatch({ type: PATIENT_LIST_SUCCESS, payload: filteredData });
  } catch (error) {
    dispatch({ type: PATIENT_LIST_FAIL, payload: error.message });
  }
};

export const appmntList = () => async (dispatch, getState) => { 
  try {
    dispatch({ type: APPMNT_LIST_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();

    // Fetch branchCode from localStorage
    const branchCode = localStorage.getItem("branchCode");

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
        branchCode: branchCode, // Include branchCode in headers
      },
    };

    const { data } = await axios.get(`${API}data/odatafilter?webservice=QyAppointmentHeader`, config);

    // Filter the patients by branchCode matching GlobalDimension1Code
    const filteredData = data.filter((patient) => patient.Branch === branchCode);
    

    dispatch({ type: APPMNT_LIST_SUCCESS, payload: filteredData });
  } catch (error) {
    dispatch({ type: APPMNT_LIST_FAIL, payload: error.message });
  }
};

export const convertPatient = (visitorNo) => async (dispatch, getState) => {
  try {
    dispatch({ type:CONVERT_TO_PATIENT_REQUEST  });

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


  const {data} = await axios.post(
      `${API}Reception/ConvertVisitorToPatient `,
      { visitorNo: visitorNo },
      config
    );

  //  // Extract response details
    const responseData =data.patientNo;

    dispatch({ type: CONVERT_TO_PATIENT_SUCCESS, payload: responseData });
    //message with success message and observationNo
return responseData
  } catch (error) {
    dispatch({
      type: CONVERT_TO_PATIENT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    message.error(error.message, 5);
    throw error; // Rethrow error for `handleSubmit` to handle
  }
};



export const activePatients = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ACTIVE_lIST_REQUEST });

    const {
        otpVerify: { userInfo },
    } = getState();
 // Fetch branchCode from localStorage
 const branchCode = localStorage.getItem("branchCode");

    const config = {
        headers: {
            "Content-Type": "application/json",
            staffNo: userInfo.userData.no, // Add staffNo as a custom header
            sessionToken: userInfo.userData.portalSessionToken, // Add sessionToken as a Bearer token
            branchCode: branchCode
          },
    };

    const { data } = await axios.get(`${API}data/odatafilter?webservice=QyAppointmentHeader`, config);

    dispatch({ type: ACTIVE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ACTIVE_LIST_FAIL, payload: error.message });
  }
};


export const getPatientByNo = (patientNo) => async (dispatch, getState) => {
  try {
    dispatch({ type: PATIENT_LIST_REQUEST });

    const {
      otpVerify: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        staffNo: userInfo.userData.no, // Add staffNo as a custom header
        sessionToken: userInfo.userData.portal_Session_Token, // Add sessionToken as a Bearer token
      },
    };

    // Fetch patient details by patientNo
    const { data } = await axios.get(`${API}data/odatafilter?webservice=QyPatients&$filter=patientNo eq '${patientNo}'&isList=false`, config);

    // Check if a patient was found
    if (data.length > 0) {
      dispatch({ type: PATIENT_LIST_SUCCESS, payload: data[0] });
    } else {
      dispatch({ type: PATIENT_LIST_FAIL, payload: "Patient not found" });
      message.warning("No patient found with the provided patient number.", 5);
    }
  } catch (error) {
    dispatch({ type: PATIENT_LIST_FAIL, payload: error.message });
    message.error(error.message, 5);
  }
};

export const triageList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: TRIAGE_VISIT_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await axios.get(`${API}patient/get-triage-visits`, config);

    dispatch({ type: TRIAGE_VISIT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: TRIAGE_VISIT_LIST_FAIL, payload: error.message });
  }
};

export const postDoctorTreatment =
  (
    triageId,
    vitals,
    symptoms,
    doctorNotes,
    diagnosis,
    recommendedTreatment,
    additionalNotes
  ) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: POST_DOCTOR_TREATMENT_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.accessToken}`,
        },
      };

      // Combine all data correctly for the API call
      const { data } = await axios.post(
        `${API}patient/post-doctor-treatment`,
        {
          triageId,
          vitals, // This should be an object containing vitals
          symptoms,
          doctorNotes,
          diagnosis,
          recommendedTreatment,
          additionalNotes,
        },
        config
      );

      dispatch({ type: POST_DOCTOR_TREATMENT_SUCCESS, payload: data });

      message.success(data.message, 5);
    } catch (error) {
      dispatch({ type: POST_DOCTOR_TREATMENT_FAIL, payload: error.message });
      message.error(error.message, 5);
    }
  };

export const postPatientVitals =
  (triageId, vitals) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_PATIENT_VITALS_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.accessToken}`,
        },
      };

      // Update the API request to include both triageId and vitals
      const { data } = await axios.post(
        `${API}patient/post-patient-vitals`,
        { triageId, ...vitals },
        config
      );

      dispatch({ type: POST_PATIENT_VITALS_SUCCESS, payload: data });

      message.success(data.message, 5);
    } catch (error) {
      dispatch({ type: POST_PATIENT_VITALS_FAIL, payload: error.message });
      message.error(error.message, 5);
    }
  };
