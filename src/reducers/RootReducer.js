import { combineReducers } from "@reduxjs/toolkit";
import { otpVerifyReducer, userLoginReducer, userRegisterReducer,forgotPwdReducer,resetPwdReducer } from "./userReducer";
import { patientByNoReducer, patientCreateReducer, patientListReducer, patientTriageVisitCreateReducer, postDoctorTreatmentReducer, postPatientVitalsReducer } from "./patientReducer";
import { countiesListReducer, countriesListReducer, subCountiesListReducer, clinicsListReducer } from "./DropdownReducer";
import { getTriageWaitingListReducer } from "./triage-reducers/getTriageWaitingListReducer";
import { loadUserInfo } from "../actions/loadUserInfo";
import { getTriageListReducer } from "./triage-reducers/getTriageListReducer";
import { triageWaitingListReducer } from "./TriageReducers";
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

export const rootReducer = combineReducers({
    userLogin:userLoginReducer,
    otpVerify:otpVerifyReducer,
    userRegister:userRegisterReducer,
    forgotPwd:forgotPwdReducer,
    resetPwd:resetPwdReducer,
    createPatient:patientCreateReducer,
    countriesList:countriesListReducer,
    countiesList:countiesListReducer,
    subCounties:subCountiesListReducer,
    clinics:clinicsListReducer,
    createTriageVisit:patientTriageVisitCreateReducer,
    patientList:patientListReducer,
    getPatientByNo:patientByNoReducer,
   // triageList:triageListReducer,
    postPatientVitals:postPatientVitalsReducer,
    postDoctorTreatment:postDoctorTreatmentReducer,
    loadUserInfo:loadUserInfo,
    getTriageWaitingList:getTriageWaitingListReducer,
    getTriageList:getTriageListReducer,
    triageWaitingList:triageWaitingListReducer,
    getPatientDetails:getPatientDetailsReducer,
    getTriageListDetails:getTriageListDetailsReducer,
    postTriageListVitals:postTriageListVitalsReducer,
    getVitalsLines:getVitalsLinesReducer,
    postAllergiesMedication:postAllergiesMedicationReducer,
    getAllergiesAndMedications:getAllergiesAndMedicationReducer,
    postInjections:postInjectionsReducer,
    getInjectionNumber:getInjectionNumberReducer,
    getInjections:getInjectionsReducer,
    getStoreRequisitionHeaders:getStoreRequisitionHeadersReducer,
    getItems:getItemsReducer,
    getItemUnits:getItemUnitsOfMeasureReducer,
    postDressings:postDressingsReducer,
    getDressing:getDressingReducer


});