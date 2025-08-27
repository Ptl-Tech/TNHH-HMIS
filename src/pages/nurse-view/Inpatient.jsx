import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { message } from "antd";
import { subject } from "@casl/ability";
import { useAbility } from "../../hooks/casl.jsx";
import InpatientTable from "./tables/nurse-tables/InpatientTable";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import FilterInpatientList from "../../partials/nurse-partials/FilterInpatientList";

import { listDoctors } from "../../actions/DropdownListActions";
import { currentInpatient } from "../../actions/Doc-actions/currentInpatient.js";
import { getPgAdmissionsAdmittedSlice } from "../../actions/nurse-actions/getPgAdmissionsAdmittedSlice";

const Inpatient = () => {
  const ability = useAbility();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log({ location });

  const [searchName, setSearchName] = useState("");
  const [searchPatientNumber, setSearchPatientNumber] = useState("");
  const [searchAdmissionNumber, setSearchAdmissionNumber] = useState("");

  const { error: currentInpatientError } = useSelector(
    (state) => state.currentInpatient
  );
  const { loadingAdmittedPatients, admittedPatients } =
    useSelector((state) => state.getPgAdmissionsAdmitted) || {};
  const { loading, data } = useSelector((state) => state.getDoctorsList);

  useEffect(() => {
    if (currentInpatientError) message.info(currentInpatientError);
  }, [currentInpatientError]);

  const handleNavigate = (record) => {
    dispatch(currentInpatient(record));
    navigate(
      `/Dashboard/Inpatient/Patient-card?PatientNo=${record?.Patient_No}&AdmNo=${record?.Admission_No}`,
      {
        state: { patientDetails: record },
      }
    );
  };

  const isExternalDoctor = (doctorId) =>
    ability.can("read", subject("ownVisits", { doctorId })); // External Doctors
  const canReadAllVisits = (Ward) =>
    Ward
      ? Ward === location.state?.filterParam &&
        ability.can("read", "allVisits")
      : ability.can("read", "allVisits"); // Nurses & Psychologists
  const canReadCorporateVisits = (Resident_Doctor) =>
    Resident_Doctor && ability.can("read", "corporateVisits"); // Corporate Doctors

  const filterConsultations = () =>
    admittedPatients?.filter(
      (item) =>
        canReadAllVisits(item.Ward) ||
        isExternalDoctor(item.DoctorID) ||
        canReadCorporateVisits(item.Resident_Doctor)
    );

  console.log({ admittedPatients });

  const inPatients = filterConsultations();

  useEffect(() => {
    dispatch(getPgAdmissionsAdmittedSlice());
  }, [dispatch]);

  useEffect(() => {
    if (!data?.length) {
      dispatch(listDoctors());
    }
  }, [dispatch, data?.length]);

  return (
    <div style={{ margin: "20px 10px 10px 10px" }}>
      <NurseInnerHeader
        title="Current Inpatients"
        filterInPatients={inPatients}
      />
      <FilterInpatientList
        setSearchName={setSearchName}
        setSearchPatientNumber={setSearchPatientNumber}
        setSearchAdmissionNumber={setSearchAdmissionNumber}
      />
      <InpatientTable
        loading={loading}
        searchName={searchName}
        filterInPatients={inPatients}
        handleNavigate={handleNavigate}
        searchPatientNumber={searchPatientNumber}
        searchAdmissionNumber={searchAdmissionNumber}
        loadingAdmittedPatients={loadingAdmittedPatients}
      />
    </div>
  );
};

export default Inpatient;
