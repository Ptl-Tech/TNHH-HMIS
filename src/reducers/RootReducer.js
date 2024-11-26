import { combineReducers } from "@reduxjs/toolkit";
import { otpVerifyReducer, userLoginReducer, userRegisterReducer,forgotPwdReducer,resetPwdReducer } from "./userReducer";
import { patientCreateReducer, patientListReducer, patientTriageVisitCreateReducer, postDoctorTreatmentReducer, postPatientVitalsReducer, triageListReducer } from "./patientReducer";
import { getTriageWaitingListReducer } from "./triage-reducers/getTriageWaitingListReducer";

export const rootReducer = combineReducers({
    userLogin:userLoginReducer,
    otpVerify:otpVerifyReducer,
    userRegister:userRegisterReducer,
    forgotPwd:forgotPwdReducer,
    resetPwd:resetPwdReducer,
    createPatient:patientCreateReducer,
    createTriageVisit:patientTriageVisitCreateReducer,
    patientList:patientListReducer,
    triageList:triageListReducer,
    postPatientVitals:postPatientVitalsReducer,
    postDoctorTreatment:postDoctorTreatmentReducer,
    getTriageWaitingList:getTriageWaitingListReducer

});