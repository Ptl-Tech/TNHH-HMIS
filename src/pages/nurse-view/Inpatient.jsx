import { Card, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
import InpatientTable from "./tables/nurse-tables/InpatientTable";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import { getPgAdmissionsAdmittedSlice } from "../../actions/nurse-actions/getPgAdmissionsAdmittedSlice";
import { listDoctors } from "../../actions/DropdownListActions";

const Impatient = () => {
  const dispatch = useDispatch();
  const userDetails = useAuth();  // Use the custom hook to get user info
  const { loading, data } = useSelector(state => state.getDoctorsList);
 
  const navigate = useNavigate();

  const handleNavigate = (record) => {
   if(userDetails.userData.departmentName === 'Nurse'){
    navigate(`/Nurse/Inpatient/Patient-card?PatientNo=${record?.Patient_No}&AdmNo=${record?.Admission_No}`, {
      state: { patientDetails: record },
    });
   }else{
    navigate(`/Doctor/Inpatient/Patient-card?PatientNo=${record?.Patient_No}&AdmNo=${record?.Admission_No}`, {
      state: { patientDetails: record },
    });
   }
  };

  const {loadingAdmittedPatients, admittedPatients} = useSelector((state)=>state.getPgAdmissionsAdmitted) || {}

  const formattedDoctorDetails = useMemo(() => {
          return data?.map(doctor => ({
              DoctorID: doctor?.DoctorID,
              DoctorsName: doctor?.DoctorsName,
          }));
      }, [data]);

const combinedPatients = admittedPatients?.map(patient => {
  const matchingDoctor = formattedDoctorDetails?.find(doctor => (
    patient?.Doctor === doctor?.DoctorID
  ));
  return {
    ...patient,
    DoctorsName: matchingDoctor ? matchingDoctor?.DoctorsName : null,
  };
});
console.log('combined patients', combinedPatients)
     
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
      
      <NurseInnerHeader filterInPatients={combinedPatients} title="Current Inpatients" />

      <Card style={{ padding: "10px 10px 10px 10px" }}>
        <div className="admit-patient-filter-container">
          <Input placeholder="search by name" allowClear showCount />
          <span style={{ color: "gray", fontSize: "14px", fontWeight: "bold" }}>
            or
          </span>
          <Input placeholder="search by patient no" allowClear showCount />
          <span style={{ color: "gray", fontSize: "14px", fontWeight: "bold" }}>
            or
          </span>
          <Input placeholder="search by admission number" allowClear showCount />
        </div>
      </Card>

      <InpatientTable loadingAdmittedPatients={loadingAdmittedPatients} loading={loading} handleNavigate={handleNavigate} filterInPatients={combinedPatients} />

    </div>
  );
};

export default Impatient;
