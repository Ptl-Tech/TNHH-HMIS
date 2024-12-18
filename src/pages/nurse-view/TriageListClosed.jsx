import { Button, Card, Table } from 'antd'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TriageSummeryCard from './TriageSummeryCard';
import { SearchOutlined } from '@ant-design/icons';
import Loading from '../../partials/nurse-partials/Loading'
import { getTriageList } from '../../actions/triage-actions/getTriageListSlice';
import { useLocation } from 'react-router-dom';
import Search from 'antd/es/transfer/search';
import { getTriageWaitingList } from '../../actions/triage-actions/getTriageWaitingListSlice';

const TriageListClosed = () => {
  const [searchParams, setSearchParams] = useState({
    name: "",
    patientNo: "",
    observationNo: "",
  });
  const dispatch = useDispatch();
  const location = useLocation();

  const {loadingTriageList, triageList} = useSelector((state) => state.getTriageList) || {};
  const { triageWaitingList } = useSelector(state => state.getTriageWaitingList);
  const closedTriageList = triageList.filter((item)=>item.Status==='Closed') || {};

  const formattedTriageWaitingList = triageWaitingList.map(patient => {
    return {
        PatientNo: patient.PatientNo,
        SearchName: patient.SearchName,
    }
  });

  const combinedList = closedTriageList.map(room => {
    // Find the matching patient in the formattedTriageWaitingList
    const matchingPatient = formattedTriageWaitingList.find(patient => patient.PatientNo === room.PatientNo);

    // Combine room data with the matching patient's data
    return {
        ...room, // Include all fields from the room object
        PatientNo: room.PatientNo,
        SearchName: matchingPatient ? matchingPatient.SearchName : null, // Add SearchName if patient exists
    };
  });

  //get the current location path
  const currentPath = location.pathname;

//extracting values from combinedTriageWaitingListAndTriageList
  const waitingListTableDataSource = combinedList.map((item, index) => ({
    key: index + 1,
    name: item?.SearchName || ``,
    regDate: item.ObservationDate || ``,
    // age: item?.AgeinYears,
    // sex: item?.Gender,
    number: item?.PatientNo || ``,
    idNumber: item?.IDNumber  || ``,
    observationNo: item?.ObservationNo  || ``,
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


  //filtering waitingListTableDataSource

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
      dispatch(getTriageList())
  }, [dispatch]);

  useEffect(() => {
      dispatch(getTriageWaitingList());
    }, [dispatch]);

  const waitingListColumns = [
    {
      title: 'Index',
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
    },
   
    {
      title: 'Observation Date',
      dataIndex: 'regDate',
      rowScope: 'row',
    },
    
    {
      title: 'Status',
      dataIndex: 'checkIn',
      rowScope: 'row',
      width: 200,
      render: () => <Button color="danger" variant="outlined">Closed</Button>
    },
  ];
 
  return (
      <div style={{ padding: '10px 10px' }}>
          <TriageSummeryCard waitingPatient={waitingListTableDataSource} currentPath={currentPath} closedTriageList={closedTriageList}/>
          
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

export default TriageListClosed
