import { Card, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatientListSlice } from "../../actions/nurse-actions/getPatientListSlice";
import useAuth from "../../hooks/useAuth";
import InpatientTable from "./tables/nurse-tables/InpatientTable";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";

const Impatient = () => {
  const dispatch = useDispatch();
  const userDetails = useAuth();  // Use the custom hook to get user info
 
  const navigate = useNavigate();

  const handleNavigate = (record) => {
   if(userDetails.userData.departmentName === 'Nurse'){
    navigate(`/Nurse/Inpatient/Patient-card?PatientNo=${record?.PatientNo}&AdmNo=${record?.CurrentAdmNo}`, {
      state: { patientDetails: record },
    });
   }else{
    navigate(`/Doctor/Inpatient/Patient-card?PatientNo=${record?.PatientNo}&AdmNo=${record?.CurrentAdmNo}`, {
      state: { patientDetails: record },
    });
   }
  };

  useEffect(() => {
    dispatch(getPatientListSlice());
  }, [dispatch]);

  const { loadingPatientList, allPatientLList } = useSelector((state) => state.getPatientList) || {};

  const filterInPatients =
    allPatientLList?.filter((item) => item.Inpatient === true) || [];

    console.log('inpatient', filterInPatients)

  return (
    <div style={{ margin: "20px 10px 10px 10px" }}>
      
      <NurseInnerHeader filterInPatients={filterInPatients} title="Current Inpatients" />

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

      <InpatientTable loadingPatientList={loadingPatientList} handleNavigate={handleNavigate} filterInPatients={filterInPatients} />

    </div>
  );
};

export default Impatient;
