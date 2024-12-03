import { Button, Card, message, Table } from 'antd'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTriageWaitingList } from '../../actions/triage-actions/getTriageWaitingListSlice';
import TriageSummeryCard from './TriageSummeryCard';
import { SearchOutlined } from '@ant-design/icons';
import Loading from '../../partials/nurse-partials/Loading'
import { getTriageList } from '../../actions/triage-actions/getTriageListSlice';
import TriageFilters from './TriageFilters';
import { RightOutlined } from '@ant-design/icons';
import { postCheckInPatientSlice } from '../../actions/triage-actions/postCheckInPatientSlice';

const TriageList = () => {
  const [filterWaitingListType, setFilterWaitingListType] = useState('');
  const [searchQueryWaitingList, setSearchQueryWaitingList] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {loadingTriageList, triageList} = useSelector((state) => state.getTriageList) || {};

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

  const openTriageList = triageList.filter((item)=>item.Status==='New')

//extracting values from combinedTriageWaitingListAndTriageList
  const waitingListTableDataSource = openTriageList.map((item, index) => ({
    key: index + 1,
    name: item?.Names || `Patient name here`,
    regDate: item.ObservationDate,
    // age: item?.AgeinYears,
    // sex: item?.Gender,
    number: item?.PatientNo,
    idNumber: item?.IDNumber,
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
      title: 'Index',
      dataIndex: 'key',
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
      title: 'ID Number',
      dataIndex: 'idNumber',
      rowScope: 'row',
    },
    {
      title: 'Observation No',
      dataIndex: 'observationNo',
      rowScope: 'row',
    },
    {
      title: 'Observation Date',
      dataIndex: 'regDate',
      rowScope: 'row',
    },
    // {
    //   title: 'Age',
    //   dataIndex: 'age',
    //   rowScope: 'row',
    // },
    // {
    //   title: 'Sex',
    //   dataIndex: 'sex',
    //   rowScope: 'row',
    // },
    {
      title: 'Patient Number',
      dataIndex: 'number',
      rowScope: 'row',
    },
    {
      title: 'Check In',
      dataIndex: 'checkIn',
      rowScope: 'row',
      width: 200,
      render: (_, record) => <Button type='primary' onClick={()=>handleNavigate(record?.number, record?.observationNo)}><RightOutlined />Check In</Button>
    },
  ];
 
  return (
      <div style={{ padding: '10px 10px' }}>
          <TriageSummeryCard waitingPatient={waitingListTableDataSource}/>
          <Card style={{ padding: '24px 10px 10px 10px' }}>

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
          </Card>
      </div>
  )
}

export default TriageList
