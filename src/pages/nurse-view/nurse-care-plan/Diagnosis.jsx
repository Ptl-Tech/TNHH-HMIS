
import { useEffect } from "react";
import { MedicineBoxOutlined } from "@ant-design/icons";
import DoctorPrescriptionsTable from "../tables/nurse-tables/DoctordiagnosisTable";
import { useDispatch, useSelector } from "react-redux";
import { getQyTreatmentDiagnosisLinesSlice } from "../../../actions/nurse-actions/getQyTreatmentDiagnosisLinesSlice";
import { useLocation } from "react-router-dom";
import { listDoctors } from "../../../actions/DropdownListActions";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";

const Diagnosis = () => {
        const dispatch = useDispatch();
        const { patientDetails } = useLocation().state;

        const {loadingGetDoctorDiagnosis, getDiagnosis} = useSelector((state) => state.getQyTreatmentDiagnosisLines);
        const { loading, data } = useSelector(state => state.getDoctorsList);

        const formattedDoctorDetails = data.map(doctor => {
          return {
              DoctorID: doctor.DoctorID,
              DoctorsName: doctor.DoctorsName,
          }
        });

        const formattedList = getDiagnosis.map(diagnosis => {
          const matchDoctorName = formattedDoctorDetails.find(doctor => doctor.DoctorID === diagnosis.Doctor);
          return {
              ...diagnosis,
              DoctorName: matchDoctorName?.DoctorsName
          }
          
      });

      const filterFormattedList = formattedList.filter(item => item?.PatientNoF === patientDetails?.Patient_No);


          useEffect(() => {
            if(!getDiagnosis?.length){
              dispatch(getQyTreatmentDiagnosisLinesSlice());
            }
          }, [dispatch, getDiagnosis?.length]);

           useEffect(() => {
                  if(!data.length) {
                      dispatch(listDoctors());
                  }
              }, [dispatch, data.length]);
  return (
    <div>
      <NurseInnerHeader icon={<MedicineBoxOutlined />} title="Diagnosis" />
        
        <DoctorPrescriptionsTable filterFormattedList={filterFormattedList} loading={loading} loadingGetDoctorDiagnosis={loadingGetDoctorDiagnosis}/>
    </div>
  )
}

export default Diagnosis