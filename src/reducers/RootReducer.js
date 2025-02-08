import { combineReducers } from '@reduxjs/toolkit';
import {
  otpVerifyReducer,
  userLoginReducer,
  userRegisterReducer,
  forgotPwdReducer,
  resetPwdReducer,
} from './userReducer';
import {
  activePatientsReducer,
  appmntListReducer,
  convertPatientReducer,
  createWalkInPatientReducer,
  dispatchWalkInLabReducer,
  dispatchWalkInPharmacyReducer,
  patientByNoReducer,
  patientCreateReducer,
  patientListReducer,
  patientTriageVisitCreateReducer,
  postDoctorTreatmentReducer,
  postPatientVitalsReducer,
  postTriageVisitReducer,
} from './patientReducer';
import {
  countiesListReducer,
  countriesListReducer,
  subCountiesListReducer,
  subCountWardsListReducer,
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
  QyLocationsListReducer,
} from './DropdownReducer';
import { triageWaitingListReducer } from './TriageReducers';
import {
  admitVisitorReducer,
  visitorCreateReducer,
  visitorListReducer,
} from './visitorsReducer';
import { updateTriageListVitalsReducer } from './triage-reducers/updateTriageListVitalsReducer';
import { getTriageListReducer } from './triage-reducers/getTriageListReducer';

// Triage reducers
import { getPatientDetailsReducer } from './triage-reducers/getPatientDetailsReducer';
import { getTriageListDetailsReducer } from './triage-reducers/getTriageListDetailsReducer';
import { postTriageListVitalsReducer } from './triage-reducers/postTriageListVitalsReducer';
import {
  getPatientVitalsLinesReducer,
  getVitalsLinesReducer,
} from './triage-reducers/getVitalsLinesReducer';
import { postAllergiesMedicationReducer } from './triage-reducers/postAllergiesMedicationReducer';
import { getAllergiesAndMedicationReducer } from './triage-reducers/getAllergiesAndMedicationReducer';
import { postInjectionsReducer } from './triage-reducers/postInjectionsReducer';
import { getInjectionNumberReducer } from './triage-reducers/getInjectionNumberReducer';
import { getStoreRequisitionHeadersReducer } from './triage-reducers/getStoreRequisitionHeadersReducer';
import { getItemsReducer } from './triage-reducers/getItemsReducer';
import { postDressingsReducer } from './triage-reducers/postDressingsReducer';
import { getDressingReducer } from './triage-reducers/getDressingReducer';
import { getItemUnitsOfMeasureReducer } from './triage-reducers/getItemUnitsOfMeasureReducer';
import { postDispatchToDoctorReducer } from './triage-reducers/postDispatchToDoctorReducer';
import { postCheckInPatientReducer } from './triage-reducers/postCheckInPatientReducer';
import { getTriageWaitingListReducer } from './triage-reducers/getTriageWaitingListReducer';
import {
  PatientDeetsReducer,
  treatmentListReducer,
} from './doc-reducers/OutPatientReducers';
import { getPatientListReducer } from './nurse-reducers/getPatientListReducer';
import { getConsultationRoomListReducer } from './nurse-reducers/getConsultationRoomReducer';

// lab
import {
  getLabListReducer,
  postLabReducer,
  requestLabTestReducer,
  viewPatientLabTestReducer,
} from './doc-reducers/labRequestReducer';
import { getLabDetailsReducer } from './doc-reducers/getLabRequestReducer';

import {
  postRadiologyReducer,
  requestRadiologyReducer,
  viewPatientRadiologyReducer,
} from './doc-reducers/radiologyRequestReducer';
import { postDiagnosisReducer } from './doc-reducers/diagnosisRequestReducer';
import { saveAdmissionDetails } from '../actions/Doc-actions/postAdmissionRequest';
import {
  requestAdmissionReducer,
  saveAdmissionDetailsReducer,
} from './doc-reducers/admissionRequestReducers';
import {
  requestReferralReducer,
  saveReferralDetailsReducer,
} from './doc-reducers/referralRequestReducer';
import {
  savePrescriptionDetailsReducer,
  sendtoPharmacyReducer,
} from './doc-reducers/prescriptionRequestReducer';
import { sendtoPharmacy } from '../actions/Doc-actions/postPrescription';
import {
  saveSignsReducer,
  saveSyptomsReducer,
} from './doc-reducers/signs&SyptomsRequestReducer';
import { postDocInjectionsReducer } from './doc-reducers/postInjectionReducer';
import { getPatientSignsLinesReducer } from './doc-reducers/getPatientsignsLinesReducer';
import { getPatientsyptomslinesReducer } from './doc-reducers/getPatientsyptomslinesReducer';
import { getInjectionsLinesReducer } from './triage-reducers/getInjectionsLinesReducer';
import { QyHospNumberReducer } from './doc-reducers/getHospNumberReducer';
import { QySpecimenSampleSetupReducer } from './doc-reducers/getSampleSetupReducer';
import { RequestPostPatientAdmissionReducer } from './doc-reducers/Admission/postAdmitPatientReducer';
import { postAdmissionVerificationReducer } from './doc-reducers/Admission/postAdmissionVerificationReducer';
import { postAdmissionCancellationReducer } from './doc-reducers/Admission/cancelPatientAdmissionReducer';
import { getRadiologyListReducer } from './doc-reducers/getRadiologyListReducers';
import { getRadiologyDetailsReducer } from './doc-reducers/getRadiologyDetailsReducers';
import { getVerifiedAdmissionsReducer } from './doc-reducers/Admission/getVerifiedAdmissionsReducer';
import { getAdmittedPatientsReducer } from './doc-reducers/Admission/getAdmittedPatients';
import {
  getDischargeListReducer,
  getDischargeRequestListReducer,
} from './doc-reducers/Admission/getDischargeListReducer';
import { getPendingAdmissionListReducer } from './doc-reducers/Admission/getPendingAdmissionListReducer';
import {
  postInitiateInpatientDischargeReducer,
  postInpatientDischargeReducer,
} from './doc-reducers/Admission/postInpatientDischarge';
import { getAdmissionLinesReducer } from './doc-reducers/Admission/getAdmissionLinesReducer';
import { getDiagnosisLinesReducer } from './doc-reducers/getDiagnosisLinesReducer';
import { getReferralLinesReducer } from './doc-reducers/getReferralLinesReducer';
import { getNewPharmacyRequestsReducer } from './pharmacy-reducers/getNewPharmacyRequests';
import {
  postArchivePrescriptionReducer,
  postDrugIssuanceReducer,
  postPrescriptionQuantityReducer,
} from './pharmacy-reducers/postPharmacyReducers';
import {
  getPatientPharmacyReturnLinesReducer,
  getPharmacyReturnLinesListReducer,
} from './pharmacy-reducers/getPharmacyReturnLinesReducer';
import { getPharmacyHistoryList } from '../actions/pharmacy-actions/getPharmacyHistoryList';
import { getChargesSetupReducer } from './ChargesReducers/getChargesSetupReducer';
import { getSpecificInjectionReducer } from './triage-reducers/getSpecificInjectionReducer';
import { getVisitorsListReducer } from './nurse-reducers/getVisitorsListReducer';
import { postSuicidalFormReducer } from './nurse-reducers/postSuicidalFormReducer';
import { getSuicidalFormReducer } from './nurse-reducers/getSuicidalFormReducer';
import { postMentalExaminationFormReducer } from './nurse-reducers/postMentalExaminationFormReducer';
import { getMentalExaminationFormReducer } from './nurse-reducers/getMentalExaminationFormReducer';
import { getQyIpLookupValuesReducer } from './nurse-reducers/getQyIPLookupValuesReducer';
import { postDietaryIntakeFormLineReducer } from './nurse-reducers/postDietaryIntakeFormLineReducer';
import { getQyDietaryFormLineReducer } from './nurse-reducers/getQyIPDietaryFormLinesReducer';
import { postJacksonVisualFormReducer } from './nurse-reducers/postJacksonVisualFormReducer';
import { getJacksonVisualFormReducer } from './nurse-reducers/getJacksonVisualFormReducer';
import { postNurseAdmissionNotesReducer } from './nurse-reducers/postNurseAdmissionNotesReducer';
import { getNurseAdmissionNotesReducer } from './nurse-reducers/getNurseAdmissionNotesReducer';
import { getPgTreatmentDoctorNotesReducer } from './nurse-reducers/getPgTreatmentDoctorsNotesReducer';
// import { getPatientConsumablesReducer } from "./nurse-reducers/getPatientConsumablesReducer";
import { getQyLocationsReducer } from './nurse-reducers/getQyLocationsReducer';
import { postPatientConsumablesReducer } from './nurse-reducers/postPatientConsumablesReducer';
import { postPatientDoctorAdmissionReducer } from './nurse-reducers/postPatientDoctorAdmissionReducer';
import { postRequestPatientAdmissionReducer } from './nurse-reducers/postRequestPatientAdmissionReducer';
import { getPgAdmissionsVerifiedReducer } from './nurse-reducers/getPgAdmissionsVerifiedReducer';
import { getPgInpatientDischargeRequestsReducer } from './nurse-reducers/getPgInpatientDischargeRequestsReducer';
import { getPgInpatientDischargeListReducer } from './nurse-reducers/getPgInpatientDischargeListReducer';
import { getPgOpenPatientConsumablesReducer } from './nurse-reducers/getPgOpenPatientConsumablesReducer';
import { postInitiateDischargeReducer } from './nurse-reducers/postInitiateDischargeReducer';
import { postPostDischargeReducer } from './nurse-reducers/postPostDischargeReducer';
import { postCancelDischargeReducer } from './nurse-reducers/postCancelDischargeReducer';
import { postReleaseBedReducer } from './nurse-reducers/postReleaseBedReducer';
import { getPgAdmissionPendingVerificationReducer } from './nurse-reducers/getPgAdmissionsPendingVerificationReducer';
import { postVerifyAdmissionReducer } from './nurse-reducers/postVerifyAdmissionReducer';
import { postCancelAdmissionReducer } from './nurse-reducers/postCancelAdmissionReducer';
import { getInpatientAllergiesReducer } from './nurse-reducers/getInPatientAllergiesReducer';
import { getInpatientVitalsReducer } from './nurse-reducers/getInpatientVitalsReducer';
import { postDailyProcedureOrProcessReducer } from './nurse-reducers/postDailyProcedureOrProcessReducer';
import { getQyInpatientProcessProceduresReducer } from './nurse-reducers/getQyInpatientProcessProceduresReducer';
import { postInpatientInjectionReducer } from './nurse-reducers/postInpatientInjectionReducer';
import { getInpatientInjectionReducer } from './nurse-reducers/getInpatientInjectionReducer';
import { getQyTreatmentDiagnosisLinesReducer } from './nurse-reducers/getQyTreatmentDiagnosisLinesReducer';
import { getPgBedsReducer } from './nurse-reducers/getPgBedsReducer';
import { getPgWardsListReducer } from './nurse-reducers/getPgWardsListReducer';
import { postAdmissionFormDetailsReducer } from './nurse-reducers/postAdmissionFormDetailsReducer';
// import { postPatientAdmissionReducer } from "./doc-reducers/Admission/postAdmitPatientReducer";
import { getPatientVisitReducer } from "./doc-reducers/getPatientVisitDetails";
import { QySecondaryDiagnosisSetupReducer } from "./doc-reducers/getSecondaryDiagnosisSetup";
import { postInterimInvoiceReducer } from "./ChargesReducers/postInterimInvoiceReducer";
import { getQyUrgencyColorCodingSetupReducer } from "./nurse-reducers/getQyUrgencyColorCodingSetupReducer";
import { getPgWardRoomsSetupReducer } from "./nurse-reducers/getPgWardRoomsSetupReducer";
import { postVisitorListReducer } from "./nurse-reducers/postVisitorListReducer";
import { postDoctorNotesReducer } from "./doc-reducers/postDoctorNotesReducer";
import { getBillingListReducer } from "./ChargesReducers/getBillingListReducer";
import { postPatientHistoryNotesReducer } from "./doc-reducers/postPatientHistoryNotesReducer";
import { getPatientHistoryNotes } from "./doc-reducers/getPatientHistoryReducer";
import { postMSENotesReducer } from "./doc-reducers/postMSEFormReducer";
import { getPatientMSENotesReducer } from "./doc-reducers/getPatientMSELinesReducer";
import { getPatientTreamentDiagnosisLinesReducer } from "./doc-reducers/getTreatmentDiagnosisLineReducer";
import { getAdmissionsAdmittedReducer } from "./nurse-reducers/getPgAdmissionsAdmittedReducer";
import { getQyPrescriptionLinesReducer } from "./doc-reducers/QyPrescriptionLinesReducer";
import { postPatientECTRequest, getPatientECTRequest, getPatientKetamineRequest, postPatientKetamineReducer, postPatientImplantRequest } from "./doc-reducers/postDoctorProceduresReducers";
import { postPatientKetamineRequest } from "../actions/Doc-actions/postDoctorProcedures";
import { postCheckInPatientConfirmReducer } from "./doc-reducers/postCheckinPatientReducer";
import { postMarkAsCompletedReducer } from "./doc-reducers/postMarkAsCompleted";
import { dispatchWalkInLab } from "../actions/patientActions";
import { postPsychologyRequestReducer } from "./doc-reducers/psychologyReducers";
import { getReceiptPgHeadersReducer } from "./doc-reducers/getReceiptPgHeadersReducer";
import { getReceiptLinesReducer } from "./ChargesReducers/getReceiptLinesReducer";
import { postReceiptHeaderReducer } from "./ChargesReducers/postReceiptHeaderReducer";
import { getReceiptHeaderReducer } from "./ChargesReducers/getReceiptHeaderReducer";
import { postReceiptReducer } from "./ChargesReducers/postReceiptReducer";
import { getTransactionListReducer } from "./ChargesReducers/getTransactionListReducer";
import { postPatientChargesReducer } from "./ChargesReducers/postPatientChargesReducer";
import { postGenerateInvoiceReducer } from "./ChargesReducers/postGenerateInvoiceReducer";
import { getNursingCarePlanReducer, postNursingCarePlanReducer } from "./nurse-reducers/postNursingCarePlanFormReducer";
import { forwardRadiologyResultsReducer, getSingleRadiologyDetailsReducer, postRadiologyResultsReducer } from "./radiology-reducer/radiologyReducer";
import { getChargesLinesReducer } from "./ChargesReducers/getChargesLines";
import { postPrintInvoiceReducer } from "./ChargesReducers/postPrintInvoice";
import { postLabSampleReducer } from './lab-reducers/postLabSampleReducer';
import { postLabTestResultsReducer } from './lab-reducers/postLabTestResultsReducer';
import { getLabTestResultsReducer } from './lab-reducers/getLabTestResultsReducer';
import { printReceiptReducer } from './ChargesReducers/printReceiptReducer';
import { postReverseChargeReducer } from './ChargesReducers/postReverseChargeReducer';
import { getPatientReceiptsHeadersReducer, getPatientReceiptsReducer } from './ChargesReducers/getPatientReceiptsReducer';

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
  subCountyWards: subCountWardsListReducer,
  clinics: clinicsListReducer,
  kinsRelations: getrelationshipOptionsReducer,
  createTriageVisit: patientTriageVisitCreateReducer,
  patientList: patientListReducer,
  activePatients: activePatientsReducer,
  getPatientByNo: patientByNoReducer,
  getInsurance: getInsuranceReducer,
  getDoctorsList: getdoctorListReducer,
  getEmployees: getemployeesListReducer,
  getEmployeeDetails: getemployeeDetailsReducer,
  getRadiologyList: getRadiologyListReducer,
  getRadiologyDetails: getRadiologyDetailsReducer,
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
  getSpecificInjection: getSpecificInjectionReducer,
  postTriageListVitals: postTriageListVitalsReducer,
  getVitalsLines: getVitalsLinesReducer,
  getPatientVital: getPatientVitalsLinesReducer,
  postAllergiesMedication: postAllergiesMedicationReducer,
  getAllergiesAndMedications: getAllergiesAndMedicationReducer,
  postInjections: postInjectionsReducer,
  getInjectionNumber: getInjectionNumberReducer,
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
  getHMSsetup: QYHMSReducer,
  getRadiologySetup: QyRadiologyTestsSetupReducer,
  getlabRequestSetup: QyLabTestsSetupReducer,
  postLabRequest: postLabReducer,
  postRadiologyRequest: postRadiologyReducer,
  getDiagnosisSetup: QyDiagnosisTestsSetupReducer,
  requestLabTest: requestLabTestReducer,
  requestRadiologyTest: requestRadiologyReducer,
  postdiagnosis: postDiagnosisReducer,
  saveAdmissionDetails: saveAdmissionDetailsReducer,
  requestAdmission: requestAdmissionReducer,
  saveRefferalDetails: saveReferralDetailsReducer,
  requestRefferal: requestReferralReducer,
  postPrescription: savePrescriptionDetailsReducer,
  sendtoPharmacy: sendtoPharmacyReducer,
  saveSigns: saveSignsReducer,
  saveSyptoms: saveSyptomsReducer,
  patientLabTest: viewPatientLabTestReducer,
  patientRadiologyTest: viewPatientRadiologyReducer,

  // lab
  labList: getLabListReducer,
  labDetails: getLabDetailsReducer,
  getLabTestResults: getLabTestResultsReducer,
  postLabSample: postLabSampleReducer,
  postLabTestResults: postLabTestResultsReducer,
  // ************************************* /

  getIPVisitors: getVisitorsListReducer,
  postSuicidalForm: postSuicidalFormReducer,
  getIpSuicidalForm: getSuicidalFormReducer,
  postMentalStatusExaminationForm: postMentalExaminationFormReducer,
  getMentalStatusExaminationForm: getMentalExaminationFormReducer,
  getQyIpLookupValues: getQyIpLookupValuesReducer,
  postDietaryIntakeFormLine: postDietaryIntakeFormLineReducer,
  getQyDietaryFormLine: getQyDietaryFormLineReducer,
  postJacksonVisualForm: postJacksonVisualFormReducer,
  getJacksonVisualForm: getJacksonVisualFormReducer,
  postNurseAdmissionNotes: postNurseAdmissionNotesReducer,
  getNurseAdmissionNotes: getNurseAdmissionNotesReducer,
  getPgTreatmentDoctorNotes: getPgTreatmentDoctorNotesReducer,
  postPatientConsumables: postPatientConsumablesReducer,
  // getPatientConsumables:getPatientConsumablesReducer,
  getQyLocations: getQyLocationsReducer,
  postPatientDoctorAdmission: postPatientDoctorAdmissionReducer,
  postRequestPatientAdmission: postRequestPatientAdmissionReducer,
  getPgAdmissionVerified: getPgAdmissionsVerifiedReducer,
  getPgInpatientDischargeRequests: getPgInpatientDischargeRequestsReducer,
  getPgInpatientDischargeList: getPgInpatientDischargeListReducer,
  getPgOpenPatientConsumables: getPgOpenPatientConsumablesReducer,
  postInitiateDischarge: postInitiateDischargeReducer,
  postPostDischarge: postPostDischargeReducer,
  postCancelDischarge: postCancelDischargeReducer,
  postReleaseBed: postReleaseBedReducer,
  getPgAdmissionsPendingVerification: getPgAdmissionPendingVerificationReducer,
  postVerifyAdmission: postVerifyAdmissionReducer,
  postCancelAdmission: postCancelAdmissionReducer,
  getInpatientAllergies: getInpatientAllergiesReducer,
  getInpatientVitals: getInpatientVitalsReducer,
  postDailyProcedureOrProcess: postDailyProcedureOrProcessReducer,
  getQyInpatientProcessProcedure: getQyInpatientProcessProceduresReducer,
  postInpatientInjection: postInpatientInjectionReducer,
  getInpatientInjection: getInpatientInjectionReducer,
  getQyTreatmentDiagnosisLines: getQyTreatmentDiagnosisLinesReducer,
  getPgBeds: getPgBedsReducer,
  getPgWardsList: getPgWardsListReducer,
  postAdmissionFormDetails: postAdmissionFormDetailsReducer,
  // postPatientAdmission:postPatientAdmissionReducer
  getQyUrgencyColorCodingSetup: getQyUrgencyColorCodingSetupReducer,
  getPgWardRoomsSetup: getPgWardRoomsSetupReducer,
  getLocationsSetup: QyLocationsListReducer,
  postDoctorInjections: postDocInjectionsReducer,
  getPatientsSigns: getPatientSignsLinesReducer,
  getPatientSyptoms: getPatientsyptomslinesReducer,
  getInjectionLines: getInjectionsLinesReducer,
  getHosNumber: QyHospNumberReducer,
  getSampleSetup: QySpecimenSampleSetupReducer,
  postAdmitPatient: RequestPostPatientAdmissionReducer,
  postAdmissionVerification: postAdmissionVerificationReducer,
  cancelPatientAdmission: postAdmissionCancellationReducer,
  getVerifiedAdmissionList: getVerifiedAdmissionsReducer,
  getAdmissionList: getAdmittedPatientsReducer,
  getDischargeList: getDischargeListReducer,
  getDischargeListRequests: getDischargeRequestListReducer,
  getPendingAdmissions: getPendingAdmissionListReducer,
  // postInitiateDischarge:postInitiateInpatientDischargeReducer,
  postInpatient: postInpatientDischargeReducer,
  getAdmissionLines: getAdmissionLinesReducer,
  getDiagnosisLines: getDiagnosisLinesReducer,
  getReferralLines: getReferralLinesReducer,
  getNewPharmacyList: getNewPharmacyRequestsReducer,
  postDrugIssuance: postDrugIssuanceReducer,
  postPrescriptionQuantity: postPrescriptionQuantityReducer,
  postArchivePrescription: postArchivePrescriptionReducer,
  getPharmacyReturnLinesList: getPharmacyReturnLinesListReducer,
  getPatientPharmacyReturnLine: getPatientPharmacyReturnLinesReducer,
  getPharmacyHistoryList: getPharmacyHistoryList,
  getPatientVisit: getPatientVisitReducer,
  getSecondaryDiagnosisSetup: QySecondaryDiagnosisSetupReducer,
  postInterimInvoice: postInterimInvoiceReducer,
  postDoctorNotes:postDoctorNotesReducer,
  getBillingList:getBillingListReducer,
  postVisitorList:postVisitorListReducer,
  postPatientHistory:postPatientHistoryNotesReducer,
  getPatientHistoryNotesReducer:getPatientHistoryNotes,
  postMSEForm:postMSENotesReducer,
  getPatientMSE:getPatientMSENotesReducer,
  getTreatmentDiagnosisLines:getPatientTreamentDiagnosisLinesReducer,
  getPgAdmissionsAdmitted:getAdmissionsAdmittedReducer,
  getQyPrescriptionLine:getQyPrescriptionLinesReducer,
  postPatientETC:postPatientECTRequest,
  getPatientETC:getPatientECTRequest,
  postKetamine:postPatientKetamineReducer,
  getKetamine:getPatientKetamineRequest,
  postImplant:postPatientImplantRequest,
  checkInConsulation:postCheckInPatientConfirmReducer,
  markAsCompleted:postMarkAsCompletedReducer,
  createWalkInPatient:createWalkInPatientReducer,
  dispatchWalkInLab:dispatchWalkInLabReducer,
  dispatchWalkInPharmacy:dispatchWalkInPharmacyReducer,
  postPsychologyRequest:postPsychologyRequestReducer,
  getReceiptHeaders:getReceiptPgHeadersReducer,
  getReceiptLines:getReceiptLinesReducer,
  getReceiptHeaderLines:getReceiptHeaderReducer,
  postReceipt:postReceiptHeaderReducer,
  processReceipt:postReceiptReducer,
  printInvoice:postPrintInvoiceReducer,
  printReceipt:printReceiptReducer  ,
  getTransactionList:getTransactionListReducer,
  getChargesSetup:getChargesSetupReducer,
  getChargesLines:getChargesLinesReducer,
  postPatientCharges:postPatientChargesReducer,
  generateInvoice:postGenerateInvoiceReducer,
  postReverseCharges:postReverseChargeReducer,
  getPatientReceipt:getPatientReceiptsReducer,
  getPatientReceiptHeader:getPatientReceiptsHeadersReducer,
  postNursingCarePlan:postNursingCarePlanReducer,
  getNursingCarePlan:getNursingCarePlanReducer,

  // radiology reducers
  postRadiologyResults: postRadiologyResultsReducer,
  getSingleRadiologyDetails: getSingleRadiologyDetailsReducer,
  forwardRadiologyResults: forwardRadiologyResultsReducer,
});
