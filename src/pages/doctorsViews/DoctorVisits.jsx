import { Button, Card, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getOutPatientTreatmentList } from '../../actions/Doc-actions/OutPatientAction';
import { listPatients } from '../../actions/patientActions';
import Loading from '../../partials/nurse-partials/Loading';
import ConsultationRoomSummeryCard from './ConsultationRoomSummeryCard';
import Search from 'antd/es/transfer/search';

const DoctorVisits = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [searchParams, setSearchParams] = useState({
    name: "",
    patientNo: "",
    treatmentNo: "",
  });
  
  const { loading: treatmentListLoading, patients: treatmentList } = useSelector(
    (state) => state.docTreatmentList
  ) || {};

  const { patients } = useSelector((state) => state.patientList);

  useEffect(() => {
    dispatch(listPatients());
  }, [dispatch]);

  const openDoctorVisitList = treatmentList?.filter((item) => item.Status === 'New');

  // Pre-populate treatment list with patient details
  const openDoctorVisitListWithPatientDetails = openDoctorVisitList?.map((item) => {
    const patient = patients.find((patient) => patient.PatientNo === item.PatientNo);
    return {
      ...item,
      SearchName: patient?.SearchName,
      IDNumber: patient?.IDNumber,
    };
  });

  const waitingListTableDataSource = openDoctorVisitListWithPatientDetails
    ?.map((item, index) => ({
      key: index + 1,
      treatmentNo: item?.TreatmentNo,
      patientNo: item?.PatientNo,
      observationNo: item?.ObservationNo,
      treatmentDate: item?.TreatmentDate,
      treatmentTime: item?.TreatmentTime,
      searchName: item?.SearchName,
      idNumber: item?.IDNumber,
    }))
    .sort((a, b) => new Date(a.treatmentDate) - new Date(b.treatmentDate));

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

  const waitingListColumns = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Treatment No',
      dataIndex: 'treatmentNo',
      key: 'treatmentNo',
    },
    {
      title: 'Patient No',
      dataIndex: 'patientNo',
      key: 'patientNo',
    },
    // {
    //   title: 'Search Name',
    //   dataIndex: 'searchName',
    //   key: 'searchName',
    //   render: (_, record) => {
    //     const patient = patients?.find((patient) => patient.PatientNo === record.patientNo);
    //     return patient ? patient.SearchName : "Name not found"; // Check for undefined patient
    //   },
    // },
    // {
    //   title: 'ID Number',
    //   dataIndex: 'idNumber',
    //   key: 'idNumber',
    //   render: (_, record) => {
    //     const patient = patients?.find((patient) => patient.PatientNo === record.patientNo);
    //     return patient ? patient.IDNumber : "ID not found"; // Check for undefined patient
    //   },
    // },
    {
      title: 'Treatment Date',
      dataIndex: 'treatmentDate',
      key: 'treatmentDate',
    },
    {
      title: 'Waiting Time',
      dataIndex: 'treatmentTime',
      key: 'treatmentTime',
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
          onClick={() => handleNavigate(record, record.treatmentNo)}
        >
          <CheckOutlined /> Check In
        </Button>
      ),
    },
  ];
  
  const handleNavigate = (record, treatmentNo) => {
    navigate(`/Doctor/Consultation/Patient?TreatmentNo=${treatmentNo}`, { state: { patientNo: record.patientNo, observationNo: record.observationNo } });
    console.log('obserVationNumber:', record.observationNo);
  };

  return (
    <div style={{ padding: '10px 10px' }}>
      <ConsultationRoomSummeryCard waitingPatient={waitingListTableDataSource} currentPath={currentPath} />
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
          dataSource={filteredPatients}
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
