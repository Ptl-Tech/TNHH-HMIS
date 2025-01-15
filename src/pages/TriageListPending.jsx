import { Button, Card, Table } from 'antd'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTriageWaitingList } from '../actions/triage-actions/getTriageWaitingListSlice';
import TriageSummeryCard from './nurse-view/TriageSummeryCard';
import { SearchOutlined } from '@ant-design/icons';
import Loading from '../partials/nurse-partials/Loading'
import { getTriageList } from '../actions/triage-actions/getTriageListSlice';
import TriageFilters from './nurse-view/TriageFilters';
import { RightOutlined } from '@ant-design/icons';

const TriageListPending = () => {
  const [filterWaitingListType, setFilterWaitingListType] = useState('');
  const [searchQueryWaitingList, setSearchQueryWaitingList] = useState('');
  const [filteredWaitingList, setFilteredWaitingList] = useState([]);
  
  const dispatch = useDispatch();
  const { loadingTriageList, triageList } = useSelector((state) => state.getTriageList) || {};

  // Get pending triage list
  const pendingTriageList = Array.isArray(triageList)
    ? triageList.filter((item) => item.Status === 'Pending')
    : [];

  // Generate waitingListTableDataSource
  const waitingListTableDataSource = pendingTriageList
    .map((item, index) => ({
      key: index + 1,
      name: item?.Names || `Patient name here`,
      regDate: item.ObservationDate,
      number: item?.PatientNo,
      idNumber: item?.IDNumber,
      observationNo: item?.ObservationNo,
    }))
    .sort((a, b) => new Date(a.regDate) - new Date(b.regDate));

  // Update the filtered data whenever inputs change
  useEffect(() => {
    const filterData = () => {
      if (filterWaitingListType !== '' && searchQueryWaitingList.trim() !== '') {
        return waitingListTableDataSource.filter((item) => {
          if (filterWaitingListType === 'name') {
            return item.name.toLowerCase().includes(searchQueryWaitingList.toLowerCase());
          }
          if (filterWaitingListType === 'idNumber') {
            return item.idNumber.toLowerCase().includes(searchQueryWaitingList.toLowerCase());
          }
          if (filterWaitingListType === 'patientNo') {
            return item.number.toLowerCase().includes(searchQueryWaitingList.toLowerCase());
          }
          return false;
        });
      }
      return waitingListTableDataSource;
    };

    setFilteredWaitingList(filterData());
  }, [filterWaitingListType, searchQueryWaitingList, waitingListTableDataSource]);

  

  useEffect(() => {
    dispatch(getTriageWaitingList());
  }, [dispatch])

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
      filterSearch: true,
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
      render: (_, record) => <Button type='primary'><RightOutlined />{record.Status}</Button>
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
                dataSource={filteredWaitingList} 
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

export default TriageListPending
