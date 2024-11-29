import { combineReducers } from "@reduxjs/toolkit";
import { otpVerifyReducer, userLoginReducer, userRegisterReducer,forgotPwdReducer,resetPwdReducer } from "./userReducer";
import { activePatientsReducer, patientByNoReducer, patientCreateReducer, patientListReducer, patientTriageVisitCreateReducer, postDoctorTreatmentReducer, postPatientVitalsReducer, postTriageVisitReducer } from "./patientReducer";
import { countiesListReducer, countriesListReducer, subCountiesListReducer, clinicsListReducer, getrelationshipOptionsReducer, getInsuranceReducer, getdoctorListReducer } from "./DropdownReducer";
import { triageWaitingListReducer } from "./TriageReducers";

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
    kinsRelations:getrelationshipOptionsReducer,
    createTriageVisit:patientTriageVisitCreateReducer,
    patientList:patientListReducer,
    activePatients:activePatientsReducer,
    getPatientByNo:patientByNoReducer,
    getInsurance:getInsuranceReducer,
    getDoctorsList:getdoctorListReducer,
    postTriageVisit:postTriageVisitReducer,
   // triageList:triageListReducer,
    postPatientVitals:postPatientVitalsReducer,
    postDoctorTreatment:postDoctorTreatmentReducer,
    triageWaitingList:triageWaitingListReducer

});