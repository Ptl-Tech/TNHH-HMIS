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
    const matchingPatient = formattedTriageWaitingList.find(patient => patient.PatientNo === room.PatientNo);

    return {
        ...room, 
        PatientNo: room.PatientNo,
        SearchName: matchingPatient ? matchingPatient.SearchName : null, // Add SearchName if patient exists
    };
  });

   const location = useLocation();
   const currentPath = location.pathname;

  function handleNavigate(patientId, observationNo) {
    dispatch(postCheckInPatientSlice({observationNo})).then((data)=>{
      if(data?.status === 'success'){
        message.success('Patient checked in successfully in the triage room');
        navigate(`/Nurse/Triage/Patient?Patient_id=${patientId}&Ob_number=${observationNo}`);
      }else{
        message.error('An error occurred, please try again')
      }
    })
  }
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: combinedList.length,
});

const handleTableChange = (newPagination) => {
    setPagination(newPagination); // Update pagination settings
};

  useEffect(() => {
        dispatch(getTriageList());
}, [dispatch]);


  useEffect(() => {
      dispatch(getTriageWaitingList());
  }, [dispatch]);

  const waitingListColumns = [
    {
      title: 'Observation No',
      dataIndex: 'ObservationNo',
      key: 'ObservationNo',
    },
    {
      title: 'Patient Number',
      dataIndex: 'PatientNo',
      key: 'PatientNo',
    },
    {
      title: 'Patient Name',
      dataIndex: 'SearchName',
      key: 'SearchName',
      filterSearch: true, // Enable search
      filters: [
        ...new Set(combinedList.map((item) => ({ text: item.SearchName, value: item.SearchName }))),
      ],
      onFilter: (value, record) => record.SearchName.includes(value),
      filterIcon: <SearchOutlined style={{ color: "rgba(0, 0, 0, 0.85)" }} />,
      render: (name, record) => (
        <div style={{ color: getColorByWaitingTime(record.ObservationTime) }}>
          {name}
        </div>
      )
    },
    
    {
      title: 'Observation Date',
      dataIndex: 'ObservationDate',
      key: 'ObservationDate',
    },

    {
      title: 'Waiting Time',
      dataIndex: 'ObservationTime',
      key: 'ObservationTime',
      render: (_, record) => {
        const combinedDateTime = `${record.ObservationDate}T${record.ObservationTime}`;
        const elapsedMinutes = dayjs().diff(dayjs(combinedDateTime), 'minute'); // Calculate elapsed time in minutes

        return <div style={{ color: getColorByWaitingTime(elapsedMinutes) }}>{formatElapsedTime(elapsedMinutes)}</div>;
    },
    },
    
    {
      title: 'Check In',
      dataIndex: 'checkIn',
      key: 'checkIn',
      width: 200,
      render: (_, record) => <Button type='primary' onClick={()=>handleNavigate(record?.PatientNo, record?.ObservationNo)}><CheckOutlined />Check In</Button>
    },
  ];
 
  return (
      <div style={{ padding: '10px 10px' }}>
          <TriageSummeryCard waitingPatient={combinedList} currentPath={currentPath} openTriageList={openTriageList}/>
         

          <Card style={{ padding: '10px 16px', marginBottom: '10px', backgroundColor: '#fcfafa' }}>
          <div className='admit-patient-filter-container'>
                  <Search placeholder="search by name" 
                      allowClear
                  />
                  <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold' }}>or</span>
                  <Search placeholder="search by patient no" 
                      allowClear
                  />
                  <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold'}}>or</span>
                  <Search placeholder="search by observation no" 
                      allowClear
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
                dataSource={combinedList} 
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
