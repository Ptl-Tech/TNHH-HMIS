import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import useAuth from "../../hooks/useAuth";
import InpatientTable from "./tables/nurse-tables/InpatientTable";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import FilterInpatientList from "../../partials/nurse-partials/FilterInpatientList";

import { listDoctors } from "../../actions/DropdownListActions";
import { currentInpatient } from "../../actions/Doc-actions/currentInpatient.js";
import { getPgAdmissionsAdmittedSlice } from "../../actions/nurse-actions/getPgAdmissionsAdmittedSlice";
import { message } from "antd";

const Impatient = () => {
  const userDetails = useAuth(); // Use the custom hook to get user info
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const doctorId = useAuth().userData.doctorID;
  const role = useAuth().userData.departmentName;

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
    if (userDetails.userData.departmentName === "Nurse") {
      navigate(
        `/Nurse/Inpatient/Patient-card?PatientNo=${record?.Patient_No}&AdmNo=${record?.Admission_No}`,
        {
          state: { patientDetails: record },
        }
      );
    } else if (userDetails.userData.departmentName === "Doctor") {
      navigate(
        `/Doctor/Inpatient/Patient-card?PatientNo=${record?.Patient_No}&AdmNo=${record?.Admission_No}`,
        {
          state: { patientDetails: record },
        }
      );
    } else {
      navigate(
        `/Psychology/Inpatient/Patient-card?PatientNo=${record?.Patient_No}&AdmNo=${record?.Admission_No}`,
        {
          state: { patientDetails: record },
        }
      );
    }
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

  // filter the patient based on the doctor
  const filterPatientBasedWithDoctor = useMemo(() => {
    if (role === "Doctor") {
      return combinedPatients?.filter(
        (patient) => patient?.Doctor === doctorId
      );
    }
    return combinedPatients;
  }, [combinedPatients, doctorId, role]);

  const filteredByStatus = useMemo(() => {
    return filterPatientBasedWithDoctor?.filter(
      ({ Status }) => Status === "Admitted" || Status === "Discharge Pending"
    );
  });

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

export default Impatient;
