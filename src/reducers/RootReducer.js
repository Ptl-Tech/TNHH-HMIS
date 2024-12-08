import { combineReducers } from "@reduxjs/toolkit";
import { otpVerifyReducer, userLoginReducer, userRegisterReducer,forgotPwdReducer,resetPwdReducer } from "./userReducer";
import { activePatientsReducer, appmntListReducer, convertPatientReducer, patientByNoReducer, patientCreateReducer, patientListReducer, patientTriageVisitCreateReducer, postDoctorTreatmentReducer, postPatientVitalsReducer, postTriageVisitReducer } from "./patientReducer";
import { countiesListReducer, countriesListReducer, subCountiesListReducer, clinicsListReducer, getrelationshipOptionsReducer, getInsuranceReducer, getdoctorListReducer, getemployeesListReducer, getmarketingStrategiesReducer } from "./DropdownReducer";
import { triageWaitingListReducer } from "./TriageReducers";
import { admitVisitorReducer, visitorCreateReducer, visitorListReducer } from "./visitorsReducer";

export const rootReducer = combineReducers({
    userLogin:userLoginReducer,
    otpVerify:otpVerifyReducer,
    userRegister:userRegisterReducer,
    forgotPwd:forgotPwdReducer,
    resetPwd:resetPwdReducer,
    createPatient:patientCreateReducer,
    convertPatient:convertPatientReducer,
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
    getEmployees:getemployeesListReducer,
    postTriageVisit:postTriageVisitReducer,
    marketingList:getmarketingStrategiesReducer,
   // triageList:triageListReducer,
    postPatientVitals:postPatientVitalsReducer,
    postDoctorTreatment:postDoctorTreatmentReducer,
    triageWaitingList:triageWaitingListReducer,
    registerVisitor:visitorCreateReducer,
    visitorsList:visitorListReducer,
    admitVisitor:admitVisitorReducer,
    appmntList:appmntListReducer,

});