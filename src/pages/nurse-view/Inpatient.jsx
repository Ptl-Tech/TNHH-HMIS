
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatientListSlice } from "../../actions/nurse-actions/getPatientListSlice";
import useAuth from "../../hooks/useAuth";
import InpatientTable from "./tables/nurse-tables/InpatientTable";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import FilterInpatientList from "../../partials/nurse-partials/FilterInpatientList";

const Impatient = () => {
  const dispatch = useDispatch();
  const userDetails = useAuth();  // Use the custom hook to get user info
  const [searchName, setSearchName] = useState('');
  const [searchPatientNumber, setSearchPatientNumber] = useState('');
  const [searchAdmissionNumber, setSearchAdmissionNumber] = useState('')
 
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

  return (
    <div style={{ margin: "20px 10px 10px 10px" }}>
      
      <NurseInnerHeader filterInPatients={filterInPatients} title="Current Inpatients" />

      <FilterInpatientList setSearchName={setSearchName} setSearchPatientNumber={setSearchPatientNumber} setSearchAdmissionNumber={setSearchAdmissionNumber}/> 

      <InpatientTable loadingPatientList={loadingPatientList} handleNavigate={handleNavigate} filterInPatients={filterInPatients} searchName={searchName} searchPatientNumber={searchPatientNumber} searchAdmissionNumber={searchAdmissionNumber} />

    </div>
  );
};

export default Impatient;
