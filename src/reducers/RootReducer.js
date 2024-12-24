import { combineReducers } from "@reduxjs/toolkit";
import {
  otpVerifyReducer,
  userLoginReducer,
  userRegisterReducer,
  forgotPwdReducer,
  resetPwdReducer,
} from "./userReducer";
import {
  activePatientsReducer,
  appmntListReducer,
  convertPatientReducer,
  patientByNoReducer,
  patientCreateReducer,
  patientListReducer,
  patientTriageVisitCreateReducer,
  postDoctorTreatmentReducer,
  postPatientVitalsReducer,
  postTriageVisitReducer,
} from "./patientReducer";
import {
  countiesListReducer,
  countriesListReducer,
  subCountiesListReducer,
  clinicsListReducer,
  getrelationshipOptionsReducer,
  getInsuranceReducer,
  getdoctorListReducer,
  getemployeesListReducer,
  getmarketingStrategiesReducer,
  QySymptomsSetupReducer,
  QySignsSetupReducer,
  QYHMSReducer,
  QyLabTestsSetupReducer,
  QyRadiologyTestsSetupReducer,
  QyDiagnosisTestsSetupReducer,
  getemployeeDetailsReducer,
} from "./DropdownReducer";
import { triageWaitingListReducer } from "./TriageReducers";
import {
  admitVisitorReducer,
  visitorCreateReducer,
  visitorListReducer,
} from "./visitorsReducer";
import { updateTriageListVitalsReducer } from "./triage-reducers/updateTriageListVitalsReducer";
import { getTriageListReducer } from "./triage-reducers/getTriageListReducer";

// Triage reducers
import { getPatientDetailsReducer } from "./triage-reducers/getPatientDetailsReducer";
import { getTriageListDetailsReducer } from "./triage-reducers/getTriageListDetailsReducer";
import { postTriageListVitalsReducer } from "./triage-reducers/postTriageListVitalsReducer";
import { getVitalsLinesReducer } from "./triage-reducers/getVitalsLinesReducer";
import { postAllergiesMedicationReducer } from "./triage-reducers/postAllergiesMedicationReducer";
import { getAllergiesAndMedicationReducer } from "./triage-reducers/getAllergiesAndMedicationReducer";
import { postInjectionsReducer } from "./triage-reducers/postInjectionsReducer";
import { getInjectionNumberReducer } from "./triage-reducers/getInjectionNumberReducer";
import { getInjectionsReducer } from "./triage-reducers/getInjectionsReducer";
import { getStoreRequisitionHeadersReducer } from "./triage-reducers/getStoreRequisitionHeadersReducer";
import { getItemsReducer } from "./triage-reducers/getItemsReducer";
import { postDressingsReducer } from "./triage-reducers/postDressingsReducer";
import { getDressingReducer } from "./triage-reducers/getDressingReducer";
import { getItemUnitsOfMeasureReducer } from "./triage-reducers/getItemUnitsOfMeasureReducer";
import { postDispatchToDoctorReducer } from "./triage-reducers/postDispatchToDoctorReducer";
import { postCheckInPatientReducer } from "./triage-reducers/postCheckInPatientReducer";
import { getTriageWaitingListReducer } from "./triage-reducers/getTriageWaitingListReducer";
import {
  PatientDeetsReducer,
  treatmentListReducer,
} from "./doc-reducers/OutPatientReducers";
import { getPatientListReducer } from "./nurse-reducers/getPatientListReducer";
import { getConsultationRoomListReducer } from "./nurse-reducers/getConsultationRoomReducer";
import { postLabReducer, requestLabTestReducer, viewPatientLabTestReducer } from "./doc-reducers/labRequestReducer";
import { postRadiologyReducer, requestRadiologyReducer } from "./doc-reducers/radiologyRequestReducer";
import { postDiagnosisReducer } from "./doc-reducers/diagnosisRequestReducer";
import { saveAdmissionDetails } from "../actions/Doc-actions/postAdmissionRequest";
import { requestAdmissionReducer, saveAdmissionDetailsReducer } from "./doc-reducers/admissionRequestReducers";
import { requestReferralReducer, saveReferralDetailsReducer } from "./doc-reducers/referralRequestReducer";
import { savePrescriptionDetailsReducer, sendtoPharmacyReducer } from "./doc-reducers/prescriptionRequestReducer";
import { sendtoPharmacy } from "../actions/Doc-actions/postPrescription";
import { saveSignsReducer, saveSyptomsReducer } from "./doc-reducers/signs&SyptomsRequestReducer";

export const rootReducer = combineReducers({
  userLogin: userLoginReducer,
  otpVerify: otpVerifyReducer,
  userRegister: userRegisterReducer,
  forgotPwd: forgotPwdReducer,
  resetPwd: resetPwdReducer,
  createPatient: patientCreateReducer,
  convertPatient: convertPatientReducer,
  countriesList: countriesListReducer,
  countiesList: countiesListReducer,
  subCounties: subCountiesListReducer,
  clinics: clinicsListReducer,
  kinsRelations: getrelationshipOptionsReducer,
  createTriageVisit: patientTriageVisitCreateReducer,
  patientList: patientListReducer,
  activePatients: activePatientsReducer,
  getPatientByNo: patientByNoReducer,
  getInsurance: getInsuranceReducer,
  getDoctorsList: getdoctorListReducer,
  getEmployees: getemployeesListReducer,
  getEmployeeDetails:getemployeeDetailsReducer,
  postTriageVisit: postTriageVisitReducer,
  marketingList: getmarketingStrategiesReducer,
  // triageList:triageListReducer,
  postPatientVitals: postPatientVitalsReducer,
  postDoctorTreatment: postDoctorTreatmentReducer,
  // loadUserInfo:loadUserInfo,
  getTriageWaitingList: getTriageWaitingListReducer,
  registerVisitor: visitorCreateReducer,
  visitorsList: visitorListReducer,
  getTriageList: getTriageListReducer,
  triageWaitingList: triageWaitingListReducer,
  admitVisitor: admitVisitorReducer,
  getPatientDetails: getPatientDetailsReducer,
  getTriageListDetails: getTriageListDetailsReducer,
  postTriageListVitals: postTriageListVitalsReducer,
  getVitalsLines: getVitalsLinesReducer,
  postAllergiesMedication: postAllergiesMedicationReducer,
  getAllergiesAndMedications: getAllergiesAndMedicationReducer,
  postInjections: postInjectionsReducer,
  getInjectionNumber: getInjectionNumberReducer,
  getInjections: getInjectionsReducer,
  getStoreRequisitionHeaders: getStoreRequisitionHeadersReducer,
  getItems: getItemsReducer,
  getItemUnits: getItemUnitsOfMeasureReducer,
  postDressings: postDressingsReducer,
  getDressing: getDressingReducer,
  dispatchToDoctor: postDispatchToDoctorReducer,
  checkInPatient: postCheckInPatientReducer,
  appmntList: appmntListReducer,
  docTreatmentList: treatmentListReducer,
  getPatientList: getPatientListReducer,
  getConsultationRoom: getConsultationRoomListReducer,
  getPatient: PatientDeetsReducer,
  getSymptoms: QySymptomsSetupReducer,
  getSignsSetup: QySignsSetupReducer,
  getHMSsetup:QYHMSReducer,
  getRadiologySetup:QyRadiologyTestsSetupReducer,
  getlabRequestSetup:QyLabTestsSetupReducer,
  postLabRequest:postLabReducer,
  postRadiologyRequest:postRadiologyReducer,
  getDiagnosisSetup:QyDiagnosisTestsSetupReducer,
  requestLabTest:requestLabTestReducer,
  requestRadiologyTest:requestRadiologyReducer,
  postdiagnosis:postDiagnosisReducer,
  saveAdmissionDetails:saveAdmissionDetailsReducer,
  requestAdmission:requestAdmissionReducer,
  saveRefferalDetails:saveReferralDetailsReducer,
  requestRefferal:requestReferralReducer,
  postPrescription:savePrescriptionDetailsReducer,
  sendtoPharmacy:sendtoPharmacyReducer,
  saveSigns:saveSignsReducer,
  saveSyptoms:saveSyptomsReducer,
  patientLabTest:viewPatientLabTestReducer,
});
