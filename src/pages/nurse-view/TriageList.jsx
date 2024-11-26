import { Card, Checkbox, Radio, Table, Tabs } from 'antd'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTriageWaitingList } from '../../actions/triage-actions/getTriageWaitingListSlice';

const TriageList = () => {
  const navigate = useNavigate();

  function handleNavigate(patientId) {
    navigate(`/Nurse/Triage/Patient?Patient_id=${patientId}`)
  }

  const dispatch = useDispatch();

  // const { loading, triageWaitingList } = useSelector((state) => state.triageWaitingList);

  // console.log(triageWaitingList);

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
      title: 'Check In',
      dataIndex: 'checkIn',
      rowScope: 'row',
      fixed: 'right',
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
  
  
  const waitingListData = [
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
          <Card style={{ padding: '24px 10px 10px 10px' }}>
            <Table columns={waitingListColumns} dataSource={waitingListData} bordered size='middle'/>
          </Card>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Patients in Triage" key="patientsInTriage">
          <Card style={{ padding: '24px 10px 10px 10px' }}>
              <Table columns={columns} dataSource={data} bordered size='middle'/>
          </Card>
        </Tabs.TabPane>
    </Tabs>
  )
}

export default TriageList
