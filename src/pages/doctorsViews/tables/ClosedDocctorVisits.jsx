import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { Table } from 'antd';

import Loading from '../../../partials/nurse-partials/Loading';
import ConsultationRoomSummeryCard from '../ConsultationRoomSummeryCard';

// import useAuth from '../../../hooks/useAuth';
import { rowClassName } from '../../../utils/helpers';

import { waitingListColumns } from './tables-utils';
import { getOutPatientTreatmentList } from '../../../actions/Doc-actions/OutPatientAction';
import FilterConsultationRoom from '../../../partials/nurse-partials/FilterConsultationRoom';
import { getTriageWaitingList } from '../../../actions/triage-actions/getTriageWaitingListSlice';

export default function CloseList() {
  const doctorId = null.userData.doctorID;
  const role = null.userData.departmentName;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const currentPath = location.pathname;
  const [searchName, setSearchName] = useState('');
  const [searchVisitNumber, setSearchVisitNumber] = useState('');
  const [searchPatientNumber, setSearchPatientNumber] = useState('');

  const { triageWaitingList: patients } = useSelector(
    (state) => state.getTriageWaitingList,
  );
  const { loading: treatmentListLoading, patients: treatmentList } =
    useSelector((state) => state.docTreatmentList);

  useEffect(() => {
    dispatch(getTriageWaitingList());
    dispatch(getOutPatientTreatmentList());
  }, [dispatch]);

  const openDoctorVisitList = useMemo(() => {
    return treatmentList?.filter((item) => {
      if (role === 'Doctor' || role === 'Psychology') {
        return item.Status === 'New' && item.DoctorID === doctorId;
      }
      return item.Status === 'New';
    });
  }, [treatmentList, role, doctorId]);

  const activeConsultationList = useMemo(() => {
    return treatmentList?.filter((item) => {
      if (role === 'Doctor' || role === 'Psychology') {
        return item.Status === 'Active' && item.DoctorID === doctorId;
      }
      return item.Status === 'Active';
    });
  }, [treatmentList, role, doctorId]);

  const closedConsultationList = useMemo(() => {
    return treatmentList?.filter((item) => {
      if (role === 'Doctor' || role === 'Psychology') {
        return item.Status === 'Completed' && item.DoctorID === doctorId;
      }
      return item.Status === 'Completed';
    });
  }, [treatmentList, role, doctorId]);

  const closedConsultationListWithPatientDetails = useMemo(() => {
    return patients?.map((patient) => ({
      PatientNo: patient.PatientNo,
      SearchName: patient.SearchName,
      IDNumber: patient.IDNumber,
      Age: patient.AgeinYears,
      PatientType: patient.PatientType,
      Inpatient: patient.Inpatient,
    }));
  }, [patients]);

  const combinedList = useMemo(() => {
    return closedConsultationList.map((room) => {
      const matchingPatient = closedConsultationListWithPatientDetails.find(
        (patient) => patient.PatientNo === room.PatientNo,
      );

      return {
        ...room,
        PatientNo: room?.PatientNo,
        SearchName: matchingPatient?.SearchName || '',
        IDNumber: matchingPatient?.IDNumber || '',
        Age: matchingPatient?.Age || '',
        PatientType: matchingPatient?.PatientType || '',
        Inpatient: matchingPatient?.Inpatient || '',
      };
    });
  }, [closedConsultationList, closedConsultationListWithPatientDetails]);

  const handleNavigate = (record, treatmentNo) => {
    navigate(
      role === 'Doctor'
        ? `/Doctor/Consultation-List/Patient?PatientNo=${record.PatientNo}&TreatmentNo=${treatmentNo}`
        : role === 'Psychology'
        ? `/Psychology/Consultation-List/Patient?PatientNo=${record.PatientNo}&TreatmentNo=${treatmentNo}`
        : `/Nurse/Consultation-List/Patient?PatientNo=${record.PatientNo}&TreatmentNo=${treatmentNo}`,
      {
        state: {
          patientNo: record.PatientNo,
          observationNo: record.ObservationNo,
          patientDetails: record,
        },
      },
    );
  };

  return (
    <div style={{ padding: '10px 10px' }}>
      <ConsultationRoomSummeryCard
        currentPath={currentPath}
        openDoctorVisitList={openDoctorVisitList}
        activeConsultationList={activeConsultationList}
        closedConsultationList={closedConsultationList}
      />

      <FilterConsultationRoom
        setSearchName={setSearchName}
        setSearchPatientNumber={setSearchPatientNumber}
        setSearchVisitNumber={setSearchVisitNumber}
      />

      {treatmentListLoading ? (
        <Loading />
      ) : (
        <Table
          columns={waitingListColumns({
            searchName,
            handleNavigate,
            searchVisitNumber,
            searchPatientNumber,
            checkInButton: 'View Closed',
          })}
          dataSource={combinedList}
          bordered
          size="small"
          rowClassName={rowClassName} // Apply the row color
          pagination={{
            position: ['bottom', 'right'],
            showSizeChanger: true,
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      )}
    </div>
  );
}
