import { Button, Card, Table } from 'antd'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTriageWaitingList } from '../../actions/triage-actions/getTriageWaitingListSlice';
import TriageSummeryCard from './TriageSummeryCard';
import { SearchOutlined } from '@ant-design/icons';
import Loading from '../../partials/nurse-partials/Loading'
import { getTriageList } from '../../actions/triage-actions/getTriageListSlice';
import { EditOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { formatElapsedTime, getColorByWaitingTime } from '../../utils/helpers';
import Search from 'antd/es/transfer/search';

const TriageListPending = () => {
  

  const [searchParams, setSearchParams] = useState({
    name: "",
    patientNo: "",
    observationNo: "",
  });

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const {loadingTriageList, triageList} = useSelector((state) => state.getTriageList) || {};

  const pendingTriageList = triageList.filter((item)=>item.Status==='Pending')

  //get the current location path
  const currentPath = location.pathname;

  //extracting values from combinedTriageWaitingListAndTriageList
  const waitingListTableDataSource = pendingTriageList.map((item, index) => ({
    key: index + 1,
    name: item?.Names || `Patient name here`,
    regDate: item.ObservationDate,
    observationTime: item?.ObservationTime,
    // sex: item?.Gender,
    number: item?.PatientNo,
    observationNo: item?.ObservationNo,
  })).sort((a, b) => new Date(a.DateRegistered) - new Date(b.DateRegistered));

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
    // Check if any search input has a value
    const isSearching = Object.values(searchParams).some((value) => value.trim() !== "");
  
    if (isSearching) {
      // Filter only when there's input
      const filtered = waitingListTableDataSource.filter((patient) => {
        const name = patient.name?.toLowerCase() || ""; // Handle undefined values
        const observationNo = patient.observationNo?.toLowerCase() || "";
        const number = patient.number?.toString() || "";
  
        return (
          name.includes(searchParams.name.toLowerCase()) &&
          observationNo.includes(searchParams.observationNo.toLowerCase()) &&
          number.includes(searchParams.patientNo.toLowerCase())
        );
      });
  
      setFilteredPatients(filtered);
    } else {
      // Show all records when no search criteria are provided
      setFilteredPatients(waitingListTableDataSource);
    }
  };
  

const handleOnClick = (observationNo, patientNumber) =>{
  observationNo && patientNumber && navigate(`/Nurse/Triage/Patient?Patient_id=${patientNumber}&Ob_number=${observationNo}`)
}

  useEffect(() => {
    dispatch(getTriageWaitingList());
    dispatch(getTriageList())
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
      title: 'Patient Name',
      dataIndex: 'name',
      rowScope: 'row',
      filterSearch: true, // Enable search
      filters: [
        ...new Set(waitingListTableDataSource.map((item) => ({ text: item.name, value: item.name }))),
      ],
      onFilter: (value, record) => record.name.includes(value),
      filterIcon: <SearchOutlined style={{ color: "rgba(0, 0, 0, 0.85)" }} />,
      render: (name, record) => (
        <div style={{ color: getColorByWaitingTime(record.observationTime) }}>
          {name}
        </div>
      )
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

        return <div style={{ color: getColorByWaitingTime(record.observationTime) }}>{formatElapsedTime(elapsedMinutes)}</div>;
    },
  },
  
    {
      title: 'Check In',
      dataIndex: 'checkIn',
      rowScope: 'row',
      width: 200,
      render: (_, record) => <Button type='primary' onClick={()=>handleOnClick(record.observationNo, record.number)}><EditOutlined />Edit</Button>
    },
  ];
 
  return (
      <div style={{ padding: '10px 10px' }}>
          <TriageSummeryCard waitingPatient={waitingListTableDataSource} currentPath={currentPath} pendingTriageList={pendingTriageList}/>
          
          <Card style={{ padding: '10px 16px', marginBottom: '10px' }}>
          <div className='admit-patient-filter-container'>
                  <Search placeholder="search by name" 
                      allowClear
                      value={searchParams.name}
                      onChange={(e) => handleSearchChange(e, "name")}
                      onSearch={handleFilterPatients}
                  />
                  <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold'}}>or</span>
                  <Search placeholder="search by observation no" 
                      allowClear
                      value={searchParams.idNumber}
                      onChange={(e) => handleSearchChange(e, "observationNo")}
                      onSearch={handleFilterPatients}
                  />
                   <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold'}}>or</span>
                  <Search placeholder="search by patient no" 
                      allowClear
                      value={searchParams.patientNo}
                      onChange={(e) => handleSearchChange(e, "patientNo")}
                      onSearch={handleFilterPatients}
                  />
              </div>
          </Card>

          {
            loadingTriageList ? 
            (
              <Loading />
            )
            :
            (
                <Table columns={waitingListColumns} 
                dataSource={filteredPatients} 
                bordered size='middle' 
                pagination={{
                  position: ['bottom','right'],
                  showSizeChanger: true,
                  pageSize: 10,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                }} 
                />
            )
          }
      </div>
  )
}

export default TriageListPending
