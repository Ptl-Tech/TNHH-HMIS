import { Button, Table } from 'antd'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTriageWaitingList } from '../../actions/triage-actions/getTriageWaitingListSlice';
import TriageSummeryCard from './TriageSummeryCard';
import { SearchOutlined } from '@ant-design/icons';
import Loading from '../../partials/nurse-partials/Loading'
import { getTriageList } from '../../actions/triage-actions/getTriageListSlice';
import TriageFilters from './TriageFilters';
import { RightOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { formatElapsedTime, getColorByWaitingTime } from '../../utils/helpers';

const TriageListPending = () => {
  const [filterWaitingListType, setFilterWaitingListType] = useState('');
  const [searchQueryWaitingList, setSearchQueryWaitingList] = useState('');
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const {loadingTriageList, triageList} = useSelector((state) => state.getTriageList) || {};

  const pendingTriageList = triageList.filter((item)=>item.Status==='Pending')

  //get the current location path
  const currentPath = location.pathname;

const handleOnClick = (observationNo, patientNumber) =>{
  observationNo && patientNumber && navigate(`/Nurse/Triage/Patient?Patient_id=${patientNumber}&Ob_number=${observationNo}`)
}
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



  //filtering waitingListTableDataSource
  const filterWaitingListTableDataSource = () =>{
    if(filterWaitingListType !== '' && searchQueryWaitingList.trim !== ''){
        return waitingListTableDataSource.filter((item) => {
          if(filterWaitingListType === 'name'){
            return item.name.toLowerCase().includes(searchQueryWaitingList.toLowerCase());
          }
          if(filterWaitingListType === 'idNumber'){
            return item.idNumber.toLowerCase().includes(searchQueryWaitingList.toLowerCase());
          }
          if(filterWaitingListType === 'patientNo'){
            return item.number.toLowerCase().includes(searchQueryWaitingList.toLowerCase());
          }
          return false;
        })
    }
    return waitingListTableDataSource;
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
      render: (_, record) => <Button type='primary' onClick={()=>handleOnClick(record.observationNo, record.number)}><RightOutlined />Dispatch to doctor</Button>
    },
  ];
 
  return (
      <div style={{ padding: '10px 10px' }}>
          <TriageSummeryCard waitingPatient={waitingListTableDataSource} currentPath={currentPath} pendingTriageList={pendingTriageList}/>
          
          <TriageFilters setFilterWaitingListType={setFilterWaitingListType} filterWaitingListType={filterWaitingListType} setSearchQueryWaitingList={setSearchQueryWaitingList}/>

          {
            loadingTriageList ? 
            (
              <Loading />
            )
            :
            (
                <Table columns={waitingListColumns} 
                dataSource={filterWaitingListTableDataSource()} 
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
