import { Card, Checkbox, Table, Tabs } from 'antd'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTriageWaitingList } from '../../actions/triage-actions/getTriageWaitingListSlice';
import TriageSummeryCard from './TriageSummeryCard';
import { SearchOutlined } from '@ant-design/icons';
import Loading from '../../partials/nurse-partials/Loading'
import { getTriageList } from '../../actions/triage-actions/getTriageListSlice';
import TriageFilters from './TriageFilters';

const TriageList = () => {
  const [filterWaitingListType, setFilterWaitingListType] = useState('');
  const [searchQueryWaitingList, setSearchQueryWaitingList] = useState('');
  const navigate = useNavigate();

  function handleNavigate(patientId) {
    navigate(`/Nurse/Triage/Patient?Patient_id=${patientId}`)
  }

  const dispatch = useDispatch();

  const {loadingWaitingList, triageWaitingList} = useSelector((state) => state.getTriageWaitingList) || {};

  const {triageList} = useSelector((state) => state.getTriageList) || {};

//combine triageWaitingList and triageList and filtering by status
  const combinedTriageWaitingListAndTriageList = triageWaitingList
  .map(user => {
    const triage = triageList.find(t => t.PatientNo.trim() === user.PatientNo.trim());
    return triage ? { ...user, status: triage.Status } : null;
  })
  .filter(record => {
    return record && record.status.trim().toLowerCase() === 'closed';
  });

 
//extracting values from combinedTriageWaitingListAndTriageList
  const waitingListTableDataSource = combinedTriageWaitingListAndTriageList.map((item, index) => ({
    key: index + 1,
    name: item?.Names || `${item?.Surname} ${item?.MiddleName} ${item?.LastName}`,
    regDate: item.DateRegistered,
    age: item?.AgeinYears,
    sex: item?.Gender,
    number: item?.PatientNo,
    idNumber: item?.IDNumber,
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
      title: 'Reg Date',
      dataIndex: 'regDate',
      rowScope: 'row',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      rowScope: 'row',
    },
    {
      title: 'Sex',
      dataIndex: 'sex',
      rowScope: 'row',
    },
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
      render: () => <Checkbox value={'checkIn'}></Checkbox>
    },
  ];
  const triageColumns = [
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
      title: 'Patient Number',
      dataIndex: 'number',
      rowScope: 'row',
    },
    
    {
      title: 'Reg Date',
      dataIndex: 'regDate',
      rowScope: 'row',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      rowScope: 'row',
    },
    {
      title: 'Sex',
      dataIndex: 'sex',
      rowScope: 'row',
    },
    {
      title: 'ID Number',
      dataIndex: 'idNumber',
      rowScope: 'row',
    },
    {
      title: 'Check Out',
      dataIndex: 'checkout',
      rowScope: 'row',
      fixed: 'right',
      width: 200,
      render: (_, record) => {
        return (
          <a
            style={{ color: 'blue' }}
            onClick={() => handleNavigate(record.number)}
          >
            Add details
          </a>
        );
      },
    },
  ];
  
  return (
    <Tabs style={{ padding: '10px 10px' }}>
        <Tabs.TabPane tab="Waiting List" key="waitingList">
          <TriageSummeryCard waitingPatient={combinedTriageWaitingListAndTriageList}/>
          <Card style={{ padding: '24px 10px 10px 10px' }}>

              <TriageFilters setFilterWaitingListType={setFilterWaitingListType} filterWaitingListType={filterWaitingListType} setSearchQueryWaitingList={setSearchQueryWaitingList}/>

              {
                loadingWaitingList ? 
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
        </Tabs.TabPane>
        <Tabs.TabPane tab="Patients in Triage" key="patientsInTriage">
        <TriageSummeryCard waitingPatient={combinedTriageWaitingListAndTriageList}/>
          <Card style={{ padding: '24px 10px 10px 10px' }}>

            <TriageFilters setFilterWaitingListType={setFilterWaitingListType} filterWaitingListType={filterWaitingListType} setSearchQueryWaitingList={setSearchQueryWaitingList}/>

              <Table columns={triageColumns} dataSource={filterWaitingListTableDataSource()} bordered size='middle'/>
          </Card>
        </Tabs.TabPane>
    </Tabs>
  )
}

export default TriageList
