import { combineReducers } from "@reduxjs/toolkit";
import { otpVerifyReducer, userLoginReducer, userRegisterReducer,forgotPwdReducer,resetPwdReducer } from "./userReducer";
import { patientByNoReducer, patientCreateReducer, patientListReducer, patientTriageVisitCreateReducer, postDoctorTreatmentReducer, postPatientVitalsReducer } from "./patientReducer";
import { countiesListReducer, countriesListReducer, subCountiesListReducer, clinicsListReducer } from "./DropdownReducer";
import { getTriageWaitingListReducer } from "./triage-reducers/getTriageWaitingListReducer";
import { loadUserInfo } from "../actions/loadUserInfo";
import { getTriageListReducer } from "./triage-reducers/getTriageListReducer";
import { triageWaitingListReducer } from "./TriageReducers";
import { getPatientDetailsReducer } from "./triage-reducers/getPatientDetailsReducer";

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

});