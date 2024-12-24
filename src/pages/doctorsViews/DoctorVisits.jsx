import { Button, Card, message, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getOutPatientTreatmentList } from '../../actions/Doc-actions/OutPatientAction';
import { postCheckInPatientSlice } from '../../actions/Doc-actions/postCheckInPatientSlice';
import Loading from '../../partials/nurse-partials/Loading';
import ConsultationRoomSummeryCard from './ConsultationRoomSummeryCard';
import Search from 'antd/es/transfer/search';
import { render } from 'react-dom';
import { listPatients } from '../../actions/patientActions';

const DoctorVisits = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  

  const location = useLocation();
  const currentPath = location.pathname; // Get the current URL path
  const [searchParams, setSearchParams] = useState({
    name: "",
    patientNo: "",
    treatmentNo: "",
  });
  const { patients: patientList } = useSelector((state) => state.patientList);
  const { loading: treatmentListLoading, patients: treatmentList } = useSelector(
    (state) => state.docTreatmentList
  ) || {};
  
  const combinedList = treatmentList?.map((treatment) => {
    // Log the current treatment and patientList for debugging

    console.log("Treatment:", treatment);
    
    // Find the matching patient from patientList
    const testTreatment = { PatientNo: 'PT_00012' };  // Example treatment
   const matchingPatient = patientList.find(
  (patient) => (patient.PatientNo).trim().toLowerCase() === String(treatment.PatientNo).trim().toLowerCase()
);

    console.log("Test Matching Patient:", matchingPatient);
    
    console.log("Patient List:", patientList);
    console.log("Treatment PatientNo:", treatment.PatientNo);
    
    // Log the matching patient for debugging
    console.log("Matching Patient:", matchingPatient);
  
    // Return a new object combining the treatment and patient data
    return {
      ...treatment,
      PatientNo: treatment.PatientNo,
      SearchName: matchingPatient?.SearchName || 'Unknown',
      Address: matchingPatient?.NextOfkinFullName || 'Unknown',
    };
  });
  

  
console.log(combinedList);


  const openDoctorVisitList = combinedList?.filter((item) => item.Status === 'New');
  const waitingListTableDataSource = combinedList
  ?.filter((item) => item.Status === 'New')
  ?.map((item, index) => ({
    key: index + 1,
    treatmentNo: item?.TreatmentNo,
    patientNo: item?.PatientNo,
    treatmentDate: item?.TreatmentDate,
    treatmentTime: item?.TreatmentTime,
    searchName: item.SearchName, // Directly use SearchName from combinedList
  }))
  .sort((a, b) => new Date(a.treatmentDate) - new Date(b.treatmentDate));

console.log(waitingListTableDataSource);
  const [filteredPatients, setFilteredPatients] = useState(waitingListTableDataSource);

  const handleSearchChange = (e, field) => {
    const value = e.target.value;
    setSearchParams((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    handleFilterPatients({ ...searchParams, [field]: value });
  };

  const handleFilterPatients = () => {
    const isSearching = Object.values(searchParams).some((value) => value.trim() !== "");

    if (isSearching) {
      const filtered = waitingListTableDataSource.filter((patient) => {
        const treatmentNo = patient.treatmentNo?.toLowerCase() || "";
        const patientNo = patient.patientNo?.toLowerCase() || "";

        return (
          treatmentNo.includes(searchParams.treatmentNo.toLowerCase()) &&
          patientNo.includes(searchParams.patientNo.toLowerCase())
        );
      });

      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(waitingListTableDataSource);
    }
  };

  useEffect(() => {
    if (!openDoctorVisitList?.length) {
      dispatch(getOutPatientTreatmentList());
    }
  }, [dispatch]);
  useEffect(() => {
    dispatch(listPatients());
  }, [dispatch]);
  const waitingListColumns = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Treatment No',
      dataIndex: 'TreatmentNo',
      key: 'TreatmentNo',
    },
    {
      title: 'Patient No',
      dataIndex: 'PatientNo',
      key: 'PatientNo',
    },
    {
      title: 'Patient Name',
      dataIndex: 'searchName',
      key: 'searchName',
    },
    {
      title: 'Treatment Date',
      dataIndex: 'TreatmentDate',
      key: 'TreatmentDate',
    },
    {
      title: 'Waiting Time',
      dataIndex: 'TreatmentTime',
      key: 'TreatmentTime',
      render: (_, record) => {
        const combinedDateTime = `${record.treatmentDate}T${record.treatmentTime}`;
        const elapsedMinutes = dayjs().diff(dayjs(combinedDateTime), 'minute');
        const hours = Math.floor(elapsedMinutes / 60);
        const minutes = elapsedMinutes % 60;
  
        return `${hours}h ${minutes}m`;
      },
    },
    {
      title: 'Check In',
      key: 'checkIn',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleNavigate(record, record.TreatmentNo)}
        >
          <CheckOutlined /> Check In
        </Button>
      ),
    },
  ];
  
  console.log('Treatment List:', treatmentList);
  console.log('Patient List:', patientList);
  console.log('Combined List:', combinedList);
  console.log('Waiting List Data Source:', waitingListTableDataSource);
  
  const handleNavigate = (record, treatmentNo) => {
    navigate(`/Doctor/Consultation/Patient?TreatmentNo=${treatmentNo}`, { state: { patientNo: record.PatientNo, obserVationNumber:record.ObservationNo  } });
    console.log('obserVationNumber:', record.obserVationNumber);
  };
  

  return (
    <div style={{ padding: '10px 10px' }}>
      <ConsultationRoomSummeryCard waitingPatient={waitingListTableDataSource} currentPath={currentPath}  />
      <Card style={{ padding: '10px 16px', marginBottom: '10px', backgroundColor: '#fcfafa' }}>
        <div className="admit-patient-filter-container">
          <Search
            placeholder="Search by Treatment No"
            allowClear
            value={searchParams.treatmentNo}
            onChange={(e) => handleSearchChange(e, 'treatmentNo')}
          />
          <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold' }}>or</span>
          <Search
            placeholder="Search by Patient No"
            allowClear
            value={searchParams.patientNo}
            onChange={(e) => handleSearchChange(e, 'patientNo')}
          />
        </div>
      </Card>
      {treatmentListLoading ? (
        <Loading />
      ) : (
        <Table
          columns={waitingListColumns}
          dataSource={treatmentList}
          bordered
          size="middle"
          pagination={{
            position: ['bottom', 'right'],
            showSizeChanger: true,
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      )}
    </div>
  );
};

export default DoctorVisits;
