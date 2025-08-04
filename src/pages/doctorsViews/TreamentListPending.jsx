import { Button, Card, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';
import Loading from '../../partials/nurse-partials/Loading';
import { getTriageList } from '../../actions/triage-actions/getTriageListSlice';
import { EditOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { formatElapsedTime, getColorByWaitingTime } from '../../utils/helpers';
import Search from 'antd/es/transfer/search';
import { getOutPatientTreatmentList } from '../../actions/Doc-actions/OutPatientAction';
import ConsultationRoomSummeryCard from './ConsultationRoomSummeryCard';

const TreamentListPending = () => {
  const [searchParams, setSearchParams] = useState({
    name: '',
    patientNo: '',
    observationNo: '',
  });

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { loading: treatmentListLoading, patients: treatmentList } =
    useSelector((state) => state.docTreatmentList) || {};

  const pendingTreatmentList = treatmentList?.filter(
    (item) => item.Status === 'Pending',
  );

  //get the current location path
  const currentPath = location.pathname;

  //extracting values from combinedTriageWaitingListAndTriageList

  const waitingListTableDataSource = pendingTreatmentList
    ?.map((item, index) => ({
      key: index + 1,
      treatmentNo: item?.TreatmentNo,
      patientNo: item?.PatientNo,
      treatmentDate: item?.TreatmentDate,
      treatmentTime: item?.TreatmentTime,
    }))
    .sort((a, b) => new Date(a.treatmentDate) - new Date(b.treatmentDate));

  const [filteredPatients, setFilteredPatients] = useState(
    waitingListTableDataSource,
  );

  const handleSearchChange = (e, field) => {
    const value = e.target.value;
    setSearchParams((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    handleFilterPatients({ ...searchParams, [field]: value });
  };
  const handleFilterPatients = () => {
    // Check if any search input has a value
    const isSearching = Object.values(searchParams).some(
      (value) => value.trim() !== '',
    );

    if (isSearching) {
      // Filter only when there's input
      const filtered = waitingListTableDataSource.filter((patient) => {
        const name = patient.name?.toLowerCase() || ''; // Handle undefined values
        const observationNo = patient.TreatmentNo?.toLowerCase() || '';
        const number = patient.number?.toString() || '';

        return (
          name.includes(searchParams.name.toLowerCase()) &&
          observationNo.includes(searchParams.TreatmentNo.toLowerCase()) &&
          number.includes(searchParams.patientNo.toLowerCase())
        );
      });

      setFilteredPatients(filtered);
    } else {
      // Show all records when no search criteria are provided
      setFilteredPatients(waitingListTableDataSource);
    }
  };

  const handleOnClick = (observationNo, patientNumber) => {
    observationNo &&
      patientNumber &&
      navigate(
        `/Dashboard/Triage/Patient?Patient_id=${patientNumber}&Ob_number=${observationNo}`,
      );
  };

  useEffect(() => {
    dispatch(getOutPatientTreatmentList());
  }, [dispatch]);

  const waitingListColumns = [
    {
      title: '#',
      dataIndex: 'key',
      rowScope: 'row',
    },
    {
      title: 'Observation No',
      dataIndex: 'observationNo',
      rowScope: 'row',
    },
    {
      title: 'Patient Number',
      dataIndex: 'number',
      rowScope: 'row',
    },
    {
      title: 'Observation Date',
      dataIndex: 'regDate',
      rowScope: 'row',
    },
    {
      title: 'Waiting Time',
      dataIndex: 'observationTime',
      rowScope: 'row',
      render: (_, record) => {
        const combinedDateTime = `${record.regDate}T${record.observationTime}`;
        const elapsedMinutes = dayjs().diff(dayjs(combinedDateTime), 'minute'); // Calculate elapsed time in minutes

        return (
          <div style={{ color: getColorByWaitingTime(record.observationTime) }}>
            {formatElapsedTime(elapsedMinutes)}
          </div>
        );
      },
    },

    {
      title: 'Check In',
      dataIndex: 'checkIn',
      rowScope: 'row',
      width: 200,
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleOnClick(record.observationNo, record.number)}
        >
          <EditOutlined />
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '10px 10px' }}>
      <ConsultationRoomSummeryCard
        currentPath={currentPath}
        waitingPatient={waitingListTableDataSource}
        pendingTreatmentList={pendingTreatmentList}
      />
      <Card
        style={{
          padding: '10px 16px',
          marginBottom: '10px',
          backgroundColor: '#fcfafa',
        }}
      >
        <div className="admit-patient-filter-container">
          <Search
            placeholder="search by name"
            allowClear
            value={searchParams.name}
            onChange={(e) => handleSearchChange(e, 'name')}
            onSearch={handleFilterPatients}
          />
          <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold' }}>
            or
          </span>
          <Search
            placeholder="search by observation no"
            allowClear
            value={searchParams.idNumber}
            onChange={(e) => handleSearchChange(e, 'observationNo')}
            onSearch={handleFilterPatients}
          />
          <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold' }}>
            or
          </span>
          <Search
            placeholder="search by patient no"
            allowClear
            value={searchParams.patientNo}
            onChange={(e) => handleSearchChange(e, 'patientNo')}
            onSearch={handleFilterPatients}
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
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      )}
    </div>
  );
};

export default TreamentListPending;
