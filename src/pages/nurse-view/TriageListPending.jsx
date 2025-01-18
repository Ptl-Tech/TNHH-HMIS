import { Button, Table } from 'antd'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import TriageSummeryCard from './TriageSummeryCard';
import Loading from '../../partials/nurse-partials/Loading'
import { getTriageList } from '../../actions/triage-actions/getTriageListSlice';
import { EditOutlined } from '@ant-design/icons';
import { formatElapsedTime, getColorByWaitingTime } from '../../utils/helpers';
import dayjs from 'dayjs';
import { getTriageWaitingList } from '../../actions/triage-actions/getTriageWaitingListSlice';
import FilterTriageList from '../../partials/nurse-partials/FilterTriageList';

const TriageListPending = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchName, setSearchName] = useState('');
  const [searchPatientNumber, setSearchPatientNumber] = useState('');
  const [searchObservationNumber, setSearchObservationNumber] = useState('')

  const {loadingTriageList, triageList} = useSelector((state) => state.getTriageList) || {};
  // const openTriageList = triageList.filter((item)=>item.Status==='New') || {};

  const { loadingWaitingList, triageWaitingList } = useSelector(state => state.getTriageWaitingList);
  
  
  const openTriageList = triageList.filter((item) => item.Status === 'Pending');

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

   const handleOnClick = (observationNo, patientNumber) =>{
    console.log('button clicked')
    observationNo && patientNumber && navigate(`/Nurse/Triage/Patient?Patient_id=${patientNumber}&Ob_number=${observationNo}`)
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
      filteredValue: searchObservationNumber ? [searchObservationNumber] : null,
      onFilter: (value, record) =>
        record?.ObservationNo ?
        record.ObservationNo.toLowerCase().includes(value.toLowerCase()) : false,
    },
    {
      title: 'Patient Number',
      dataIndex: 'PatientNo',
      key: 'PatientNo',
      filteredValue: searchPatientNumber ? [searchPatientNumber] : null,
      onFilter: (value, record) =>
        record?.PatientNo ?
        record.PatientNo.toLowerCase().includes(value.toLowerCase()) : false,
    },
    {
      title: 'Patient Name',
      dataIndex: 'SearchName',
      key: 'SearchName',
      filteredValue: searchName ? [searchName] : null,
      onFilter: (value, record) =>
        record?.SearchName ?
        record.SearchName.toLowerCase().includes(value.toLowerCase()) : false,
      render: (name) => (
        <div style={{ color: '#0f5689' }}>
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
      render: (_, record) => <Button type='primary' onClick={()=>handleOnClick(record.ObservationNo, record.PatientNo)}><EditOutlined />Edit</Button>
    },
  ];
 
  return (
      <div style={{ padding: '10px 10px' }}>
          <TriageSummeryCard waitingPatient={combinedList} currentPath={currentPath} openTriageList={openTriageList}/>
         

          <FilterTriageList setSearchName={setSearchName} setSearchPatientNumber={setSearchPatientNumber} setSearchObservationNumber={setSearchObservationNumber}/>
          

          {
            loadingTriageList || loadingWaitingList? 
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

export default TriageListPending
