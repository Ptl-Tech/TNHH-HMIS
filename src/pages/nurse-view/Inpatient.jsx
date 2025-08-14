import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { message } from "antd";

import { subject } from "@casl/ability";
import { useAbility } from "../../hooks/casl.jsx";
import InpatientTable from "./tables/nurse-tables/InpatientTable";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import FilterInpatientList from "../../partials/nurse-partials/FilterInpatientList";

import { useAuth } from "../../hooks/auth.jsx";
import { listDoctors } from "../../actions/DropdownListActions";
import { currentInpatient } from "../../actions/Doc-actions/currentInpatient.js";
import { getPgAdmissionsAdmittedSlice } from "../../actions/nurse-actions/getPgAdmissionsAdmittedSlice";

const Inpatient = () => {
  const { user } = useAuth();
  const ability = useAbility();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  // get the list of doctors
  const formattedDoctorDetails = useMemo(() => {
    return data?.map((doctor) => ({
      DoctorID: doctor?.DoctorID,
      DoctorsName: doctor?.DoctorsName,
    }));
  }, [data]);

  const combinedPatients = useMemo(() => {
    if (!admittedPatients || !formattedDoctorDetails) return [];

    return admittedPatients.map((patient) => {
      const matchingDoctor = formattedDoctorDetails.find(
        (doctor) => patient?.Doctor === doctor?.DoctorID
      );
      return {
        ...patient,
        DoctorsName: matchingDoctor ? matchingDoctor.DoctorsName : null,
      };
    });
  }, [admittedPatients, formattedDoctorDetails]);

  const canReadOwnInpatients = (doctorId) =>
    ability.can("read", subject("ownInPatients", { doctorId }));
  const canReadAllInpatients = ability.can("read", "inPatients");

  // filter the patient based on the doctor
  const filterPatientBasedWithDoctor = useMemo(() => {
    return combinedPatients?.filter(
      (patient) => canReadOwnInpatients(patient.Doctor) || canReadAllInpatients
    );
  }, [combinedPatients, ability]);

  const filteredByStatus = useMemo(() => {
    const filteredByStatus = filterPatientBasedWithDoctor?.filter(
      ({ Status, Branch }) =>
        (Status === "Admitted" || Status === "Discharge Pending") &&
        (user.role == "NURSE" ? Branch == location.state.filterParam : true)
    );

    return filteredByStatus;
  }, [filterPatientBasedWithDoctor]);

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
        filterInPatients={filteredByStatus}
      />
      <FilterInpatientList
        setSearchName={setSearchName}
        setSearchPatientNumber={setSearchPatientNumber}
        setSearchAdmissionNumber={setSearchAdmissionNumber}
      />
      <InpatientTable
        loading={loading}
        searchName={searchName}
        handleNavigate={handleNavigate}
        filterInPatients={filteredByStatus}
        searchPatientNumber={searchPatientNumber}
        searchAdmissionNumber={searchAdmissionNumber}
        loadingAdmittedPatients={loadingAdmittedPatients}
      />
    </div>
  );
};

export default Inpatient;
