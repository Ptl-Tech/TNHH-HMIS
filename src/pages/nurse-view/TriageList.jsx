import { Card, Checkbox, Input, Radio, Table, Tabs } from 'antd'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTriageWaitingList } from '../../actions/triage-actions/getTriageWaitingListSlice';
import TriageSummeryCard from './TriageSummeryCard';
import { SearchOutlined } from '@ant-design/icons';
import Loading from '../../partials/nurse-partials/Loading'
import { getTriageList } from '../../actions/triage-actions/getTriageListSlice';

const TriageList = () => {
  const [filterWaitingListType, setFilterWaitingListType] = useState('');
  const [searchQueryWaitingList, setSearchQueryWaitingList] = useState('');
  const navigate = useNavigate();

  function handleNavigate(patientId) {
    navigate(`/Nurse/Triage/Patient?Patient_id=${patientId}`)
  }

  const dispatch = useDispatch();

  const {loadingWaitingList, triageWaitingList} = useSelector((state) => state.getTriageWaitingList) || {};

  const {loadingTriageList, triageList} = useSelector((state) => state.getTriageList) || {};

  console.log('triage lit in component', triageList);



  const waitingListTableDataSource = triageWaitingList.map((item, index) => ({
    key: index + 1,
    name: item.Names || `${item.Surname} ${item.MiddleName} ${item.LastName}`,
    regDate: item.DateRegistered,
    age: item.AgeinYears,
    sex: item.Gender,
    number: item.PatientNo,
    idNumber: item.IDNumber,
  })).sort((a, b) => new Date(a.DateRegistered) - new Date(b.DateRegistered));

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
  }, [dispatch]);

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
      title: 'ID Number',
      dataIndex: 'idNumber',
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
  const columns = [
    {
      title: 'Index',
      dataIndex: 'key',
      rowScope: 'row',
    },
    {
      title: 'Patient Name',
      dataIndex: 'name',
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
      title: 'Check Out',
      dataIndex: 'checkout',
      rowScope: 'row',
      fixed: 'right',
      width: 200,
      render: (_, record) => {
        return (
          <a
            style={{ color: 'blue' }}
            onClick={() => handleNavigate(record.key)}
          >
            Add details
          </a>
        );
      },
    },
  ];
  
  
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      sex: 'Female',
      number: 18,
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 20,
      sex: 'Male',
      number: 13,
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      sex: 'Male',
      number: 12,
    },
    {
      key: '4',
      name: 'Jim Red',
      age: 18,
      sex: 'Male',
      number: 11,
    },
    {
      key: '5',
      name: 'Jake White',
      age: 18,
      sex: 'Female',
      number: 10,
    },
  ];

  return (
    <Tabs style={{ padding: '10px 10px' }}>
        <Tabs.TabPane tab="Waiting List" key="waitingList">
          <TriageSummeryCard waitingPatient={triageWaitingList}/>
          <Card style={{ padding: '24px 10px 10px 10px' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Radio.Group 
                  defaultValue="a" 
                  buttonStyle="solid"
                  onChange={(e) => setFilterWaitingListType(e.target.value)}
                  value={filterWaitingListType}
                  >
                  <Radio value='name'>Filter by name</Radio>
                  <Radio value='idNumber'>Filter by ID</Radio>
                  <Radio value='patientNo'>Filter by patient no</Radio>
                </Radio.Group>
                <Input 
                  showCount maxLength={20} 
                  type='search' 
                  placeholder='Search' 
                  style={{ width: '300px' }}
                  onChange={(e) => setSearchQueryWaitingList(e.target.value)}
                  />
              </div>

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
        <TriageSummeryCard waitingPatient={triageWaitingList}/>
          <Card style={{ padding: '24px 10px 10px 10px' }}>
              <Table columns={columns} dataSource={data} bordered size='middle'/>
          </Card>
        </Tabs.TabPane>
    </Tabs>
  )
}

export default TriageList
