import { Button, Table } from 'antd'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TriageSummeryCard from './TriageSummeryCard';
import { SearchOutlined } from '@ant-design/icons';
import Loading from '../../partials/nurse-partials/Loading'
import { getTriageList } from '../../actions/triage-actions/getTriageListSlice';
import TriageFilters from './TriageFilters';
import { useLocation } from 'react-router-dom';

const TriageListClosed = () => {
  const [filterWaitingListType, setFilterWaitingListType] = useState('');
  const [searchQueryWaitingList, setSearchQueryWaitingList] = useState('');
  const dispatch = useDispatch();
  const location = useLocation();

  const {loadingTriageList, triageList} = useSelector((state) => state.getTriageList) || {};

  const closedTriageList = triageList.filter((item)=>item.Status==='Closed')

  //get the current location path
  const currentPath = location.pathname;

//extracting values from combinedTriageWaitingListAndTriageList
  const waitingListTableDataSource = closedTriageList.map((item, index) => ({
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
    dispatch(getTriageList())
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
      title: 'ID Number',
      dataIndex: 'idNumber',
      rowScope: 'row',
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

export default TriageListClosed
