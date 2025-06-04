import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { message, Table } from 'antd';

import useAuth from '../../hooks/useAuth';
import { rowClassName } from '../../utils/helpers';
import Loading from '../../partials/nurse-partials/Loading';

import { postCheckInPatient } from '../../actions/Doc-actions/postCheckInPatient';
import { getOutPatientTreatmentList } from '../../actions/Doc-actions/OutPatientAction';
import { getTriageWaitingList } from '../../actions/triage-actions/getTriageWaitingListSlice';

import { waitingListColumns } from './tables/tables-utils';
import ConsultationRoomSummeryCard from './ConsultationRoomSummeryCard';
import FilterConsultationRoom from '../../partials/nurse-partials/FilterConsultationRoom';

const DoctorVisits = () => {
  const doctorId = useAuth().userData.doctorID;
  const role = useAuth().userData.departmentName;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;

  const [currentRecord, setCurrentRecord] = useState('');
  const [currentTreatmentNo, setCurrentTreatmentNo] = useState('');

  const [searchName, setSearchName] = useState('');
  const [searchPatientNumber, setSearchPatientNumber] = useState('');
  const [searchVisitNumber, setSearchVisitNumber] = useState('');

  const { loadingWaitingList, triageWaitingList: patients } = useSelector(
    (state) => state.getTriageWaitingList,
  );
  const { loading: treatmentListLoading, patients: treatmentList } =
    useSelector((state) => state.docTreatmentList);

  const {
    error: checkInError,
    checkInPatient,
    loadingCheInPatient,
  } = useSelector((state) => state.checkInConsulation);

  useEffect(() => {
    dispatch(getTriageWaitingList());
    dispatch(getOutPatientTreatmentList());
  }, [dispatch]);

  useEffect(() => {
    console.log({ checkInPatient });

    if (checkInPatient?.length && currentRecord && currentTreatmentNo) {
      message.success('Patient checked in to the Consultation Room ');
      navigate(
        role === 'Doctor'
          ? `/Doctor/Consultation-List/Patient?PatientNo=${currentRecord.PatientNo}&TreatmentNo=${currentTreatmentNo}`
          : role === 'Psychology'
          ? `/Psychology/Consultation-List/Patient?PatientNo=${currentRecord.PatientNo}&TreatmentNo=${currentTreatmentNo}`
          : `/Nurse/Consultation-List/Patient?PatientNo=${currentRecord.PatientNo}&TreatmentNo=${currentTreatmentNo}`,
        {
          state: {
            patientDetails: currentRecord,
            patientNo: currentRecord.PatientNo,
            observationNo: currentRecord.ObservationNo,
          },
        },
      );
      dispatch({ type: POST_CHECK_IN_PATIENT_RESET });
    }

    if (checkInError) {
      dispatch({ type: POST_CHECK_IN_PATIENT_RESET });
      message.error('An error occurred, please try again');
    }
  }, [checkInError, checkInPatient]);
  // console.log('consultation Room list', treatmentList);

  const openDoctorVisitList = treatmentList?.filter((item) => {
    if (role === 'Doctor') {
      return item.Status === 'New' && item.DoctorID === doctorId;
    } else if (role === 'Psychology') {
      return item.Status === 'New' && item.DoctorID === doctorId;
    }
    return item.Status === 'New';
  });

  const activeConsultationList = treatmentList?.filter((item) => {
    if (role === 'Doctor') {
      return item.Status === 'Active' && item.DoctorID === doctorId;
    } else if (role === 'Psychology') {
      return item.Status === 'Active' && item.DoctorID === doctorId;
    }
    return item.Status === 'Active';
  });

  const closedConsultationList = treatmentList?.filter((item) => {
    if (role === 'Doctor') {
      return item.Status === 'Completed' && item.DoctorID === doctorId;
    } else if (role === 'Psychology') {
      return item.Status === 'Completed' && item.DoctorID === doctorId;
    }
    return item.Status === 'Completed';
  });

  const openDoctorVisitListWithPatientDetails = patients?.map((patient) => ({
    PatientNo: patient.PatientNo,
    SearchName: patient.SearchName,
    IDNumber: patient.IDNumber,
    Age: patient.AgeinYears,
    PatientType: patient.PatientType,
    Inpatient: patient.Inpatient,
  }));

  const combinedList = openDoctorVisitList.map((room) => {
    const matchingPatient = openDoctorVisitListWithPatientDetails.find(
      (patient) => patient.PatientNo === room.PatientNo,
    );

    return {
      ...room,
      PatientNo: room?.PatientNo,
      SearchName: matchingPatient ? matchingPatient.SearchName : '',
      IDNumber: matchingPatient ? matchingPatient.IDNumber : '',
      Age: matchingPatient ? matchingPatient.Age : '',
      PatientType: matchingPatient ? matchingPatient.PatientType : '',
      Inpatient: matchingPatient ? matchingPatient.Inpatient : '',
    };
  });

  const handleNavigate = (record, treatmentNo) => {
    setCurrentRecord(record);
    setCurrentTreatmentNo(treatmentNo);
    dispatch(postCheckInPatient(treatmentNo));
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

      {loadingWaitingList || treatmentListLoading ? (
        <Loading />
      ) : (
        <Table
          bordered
          size="small"
          dataSource={combinedList}
          rowClassName={rowClassName}
          columns={waitingListColumns({
            handleNavigate,
            searchName,
            searchVisitNumber,
            searchPatientNumber,
            loading: loadingCheInPatient,
          })}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            position: ['bottom', 'right'],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      )}
    </div>
  );
};

export default DoctorVisits;
