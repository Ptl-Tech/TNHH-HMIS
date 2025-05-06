import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
import InpatientTable from "./tables/nurse-tables/InpatientTable";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import { getPgAdmissionsAdmittedSlice } from "../../actions/nurse-actions/getPgAdmissionsAdmittedSlice";
import { listDoctors } from "../../actions/DropdownListActions";
import FilterInpatientList from "../../partials/nurse-partials/FilterInpatientList";

const Impatient = () => {
  const dispatch = useDispatch();
  const userDetails = useAuth(); // Use the custom hook to get user info
  const { loading, data } = useSelector((state) => state.getDoctorsList);
  const [searchName, setSearchName] = useState("");
  const [searchPatientNumber, setSearchPatientNumber] = useState("");
  const [searchAdmissionNumber, setSearchAdmissionNumber] = useState("");
  const doctorId = useAuth().userData.doctorID;
  const role = useAuth().userData.departmentName;
  const branch = localStorage?.getItem("branchCode");

  const navigate = useNavigate();

  const handleNavigate = (record) => {
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

  const { loadingAdmittedPatients, admittedPatients } =
    useSelector((state) => state.getPgAdmissionsAdmitted) || {};

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

  // filter the patient based on the branch
  const filterPatientBasedWithBranch = useMemo(() => {
    if (branch) {
      return filterPatientBasedWithDoctor?.filter(
        (patient) => patient?.Branch === branch
      );
    }
    return filterPatientBasedWithDoctor;
  }, [filterPatientBasedWithDoctor, branch]);

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
        filterInPatients={filterPatientBasedWithBranch}
        title="Current Inpatients"
      />

      <FilterInpatientList
        setSearchName={setSearchName}
        setSearchPatientNumber={setSearchPatientNumber}
        setSearchAdmissionNumber={setSearchAdmissionNumber}
      />

      <InpatientTable
        loadingAdmittedPatients={loadingAdmittedPatients}
        loading={loading}
        handleNavigate={handleNavigate}
        filterInPatients={filterPatientBasedWithBranch}
        searchName={searchName}
        searchPatientNumber={searchPatientNumber}
        searchAdmissionNumber={searchAdmissionNumber}
      />
    </div>
  );
};

export default Impatient;
