import { Button, Card, message, Table } from 'antd'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import TriageSummeryCard from './TriageSummeryCard';
import { SearchOutlined } from '@ant-design/icons';
import Loading from '../../partials/nurse-partials/Loading'
import { getTriageList } from '../../actions/triage-actions/getTriageListSlice';
import { CheckOutlined } from '@ant-design/icons';
import { postCheckInPatientSlice } from '../../actions/triage-actions/postCheckInPatientSlice';
import { formatElapsedTime, getColorByWaitingTime } from '../../utils/helpers';
import dayjs from 'dayjs';
import Search from 'antd/es/transfer/search';
import { getTriageWaitingList } from '../../actions/triage-actions/getTriageWaitingListSlice';

const TriageList = () => {
  
  const [searchParams, setSearchParams] = useState({
    name: "",
    patientNo: "",
    observationNo: "",
  });


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {loadingTriageList, triageList} = useSelector((state) => state.getTriageList) || {};
  // const openTriageList = triageList.filter((item)=>item.Status==='New') || {};

  const { triageWaitingList } = useSelector(state => state.getTriageWaitingList);
  
  
  const openTriageList = triageList.filter((item) => item.Status === 'New');


  const formattedTriageWaitingList = triageWaitingList.map(patient => {
    return {
        PatientNo: patient.PatientNo,
        SearchName: patient.SearchName,
    }
  });

  const combinedList = openTriageList.map(room => {
    // Find the matching patient in the formattedTriageWaitingList
    const matchingPatient = formattedTriageWaitingList.find(patient => patient.PatientNo === room.PatientNo);

    // Combine room data with the matching patient's data
    return {
        ...room, // Include all fields from the room object
        PatientNo: room.PatientNo,
        SearchName: matchingPatient ? matchingPatient.SearchName : null, // Add SearchName if patient exists
    };
  });
  
  const location = useLocation();
   //get the current location path
   const currentPath = location.pathname;

  function handleNavigate(patientId, observationNo) {
    dispatch(postCheckInPatientSlice({observationNo})).then((data)=>{
      if(data?.status === 'success'){
        message.success(data?.status);
        navigate(`/Nurse/Triage/Patient?Patient_id=${patientId}&Ob_number=${observationNo}`);
      }else{
        message.error('An error occurred, please try again')
      }
    })
  }


//extracting values from combinedTriageWaitingListAndTriageList
  const waitingListTableDataSource = combinedList.map((item, index) => ({
    key: index + 1,
    // name: item?.Names || `Patient name here`,
    regDate: item.ObservationDate,
    observationTime: item?.ObservationTime,
    name: item?.SearchName || ``,
    // sex: item?.Gender,
    number: item?.PatientNo || '',
    observationNo: item?.ObservationNo || '',
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

  useEffect(() => {
    if (!triageList?.length) {
        dispatch(getTriageList());
    }
}, [triageList, dispatch]);


  useEffect(() => {
          
      if(!triageWaitingList?.length) {
          dispatch(getTriageWaitingList());
      }
  }, [dispatch, triageWaitingList.length]);

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
      render: (_, record) => <Button type='primary' onClick={()=>handleNavigate(record?.number, record?.observationNo)}><CheckOutlined />Check In</Button>
    },
  ];
 
  return (
      <div style={{ padding: '10px 10px' }}>
          <TriageSummeryCard waitingPatient={waitingListTableDataSource} currentPath={currentPath} openTriageList={openTriageList}/>
         

          <Card style={{ padding: '10px 16px', marginBottom: '10px', backgroundColor: '#fcfafa' }}>
          <div className='admit-patient-filter-container'>
                  <Search placeholder="search by name" 
                      allowClear
                      value={searchParams.name}
                      onChange={(e) => handleSearchChange(e, "name")}
                      onSearch={handleFilterPatients}
                  />
                  <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold'}}>or</span>
                  <Search placeholder="search by patient no" 
                      allowClear
                      value={searchParams.patientNo}
                      onChange={(e) => handleSearchChange(e, "patientNo")}
                      onSearch={handleFilterPatients}
                  />
                  <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold'}}>or</span>
                  <Search placeholder="search by observation no" 
                      allowClear
                      value={searchParams.idNumber}
                      onChange={(e) => handleSearchChange(e, "observationNo")}
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

export default TriageList
