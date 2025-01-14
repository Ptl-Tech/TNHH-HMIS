import { Button, Card, Table } from 'antd'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TriageSummeryCard from './TriageSummeryCard';
import Loading from '../../partials/nurse-partials/Loading'
import { getTriageList } from '../../actions/triage-actions/getTriageListSlice';
import { EditOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { formatElapsedTime, getColorByWaitingTime } from '../../utils/helpers';
import Search from 'antd/es/transfer/search';
import { SearchOutlined } from '@ant-design/icons';
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
  const { triageWaitingList } = useSelector(state => state.getTriageWaitingList);
  const pendingTriageList = triageList.filter((item)=>item.Status==='Pending')

  const formattedTriageWaitingList = triageWaitingList.map(patient => {
    return {
        PatientNo: patient.PatientNo,
        SearchName: patient.SearchName,
    }
  });

  const combinedList = pendingTriageList.map(room => {
    const matchingPatient = formattedTriageWaitingList.find(patient => patient.PatientNo === room.PatientNo);
    return {
        ...room, 
        PatientNo: room.PatientNo,
        SearchName: matchingPatient ? matchingPatient.SearchName : null, 
    };
  });

  const currentPath = location.pathname;

  const waitingListTableDataSource = combinedList.map((item, index) => ({
    key: index + 1,
    name: item?.SearchName || ``,
    regDate: item.ObservationDate || ``,
    observationTime: item?.ObservationTime || ``,
    number: item?.PatientNo || ``,
    observationNo: item?.ObservationNo || ``,
  })).sort((a, b) => new Date(a.DateRegistered) - new Date(b.DateRegistered));

  const [filteredPatients, setFilteredPatients] = useState(waitingListTableDataSource);  

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: filteredPatients.length,
});

const handleTableChange = (newPagination) => {
    setPagination(newPagination); // Update pagination settings
};

const paginatedData = filteredPatients.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
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
  if (!triageList?.length) {
      dispatch(getTriageList());
  }
}, [triageList, dispatch]);

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
          
          <Card style={{ padding: '10px 16px', marginBottom: '10px', backgroundColor: '#fcfafa' }}>
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
                  ...pagination,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  position: ['bottom', 'right'],
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                  onChange: (page, pageSize) => handleTableChange({ current: page, pageSize, total: pagination.total }),
                  onShowSizeChange: (current, size) => handleTableChange({ current, pageSize: size, total: pagination.total }),
                  style: {
                      marginTop: '30px',
                  }
              }} 
                />
            )
          }
      </div>
  )
}

export default TriageListPending
