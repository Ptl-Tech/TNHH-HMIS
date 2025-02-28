import { useEffect, useState, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Space, Table, Button, Typography, Input } from 'antd';
import { ProfileOutlined, SearchOutlined } from '@ant-design/icons';

import Loading from '../../../../partials/nurse-partials/Loading';
import { getLabList } from '../../../../actions/Doc-actions/getLabList';
import { filterByCategory, filterByStatus } from './utils';

const LabRequests = ({ status, requestType }) => {
  // hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  //   state
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const { loadinglabTreatmentHeaders, data: labTreatmentHeaders } = useSelector(
    (state) => state.labList,
  );

  const labTreatmentHeadersData = labTreatmentHeaders.filter(
    (item) =>
      filterByCategory(item, requestType) && filterByStatus(item, status),
  );

  console.log({ labTreatmentHeadersData });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: labTreatmentHeadersData.length,
  });

  useEffect(() => {
    if (!labTreatmentHeaders.length) {
      dispatch(getLabList());
    }
  }, [dispatch, labTreatmentHeaders.length]);

  //   table functions and columns
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText('');
    setSearchedColumn('');
    confirm();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) => text,
  });

  const columns = [
    {
      title: 'Doctor Name',
      key: 'Doctor_Names',
      dataIndex: 'Doctor_Names',
      ...getColumnSearchProps('Doctor_Names'),
      render: (text) => (text ? text : 'N/A'),
    },
    {
      title: 'Lab No',
      key: 'LaboratoryNo',
      dataIndex: 'LaboratoryNo',
      ...getColumnSearchProps('LaboratoryNo'),
    },
    {
      title: 'Patient No',
      key: 'PatientNo',
      dataIndex: 'PatientNo',
      ...getColumnSearchProps('PatientNo'),
    },
    {
      title: 'Patient Names',
      key: 'Patient_Names',
      dataIndex: 'Patient_Names',
      ...getColumnSearchProps('Patient_Names'),
    },
    {
      title: 'Status',
      key: 'Status',
      dataIndex: 'Status',
      render: (_, record) => {
        let statusColor;
        switch (record.Status) {
          case 'New':
            statusColor = 'orange';
            break;
          case 'Completed':
            statusColor = 'green';
            break;
          case 'Forwarded':
            statusColor = 'blue';
            break;
          case 'Voided':
            statusColor = 'red';
            break;
          default:
            statusColor = 'gray'; // Default color for unknown statuses
        }

        return (
          <Typography.Text style={{ color: statusColor, fontWeight: 'bold' }}>
            {record.Status}
          </Typography.Text>
        );
      },
    },
    {
      title: 'Laboratory Date',
      key: 'LaboratoryDate',
      dataIndex: 'LaboratoryDate',
      sorter: (a, b) =>
        new Date(a.LaboratoryDate).getTime() -
        new Date(b.LaboratoryDate).getTime(),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => {
        return (
          <Button
            type="primary"
            onClick={() => handleNavigate(record, record.LaboratoryNo)}
          >
            {record.Status === 'Completed'
              ? 'View Results'
              : record.Status === 'Recalled'
              ? 'Review Results'
              : 'View Requests'}
          </Button>
        );
      },
    },
  ];

  const handleTableChange = (newPagination) => {
    setPagination(newPagination); // Update pagination settings
  };

  const handleNavigate = (record, LaboratoryNo) => {
    navigate(`/Lab/Outpatient/Lab-Request?LaboratoryNo=${LaboratoryNo}`, {
      state: {
        patientNo: record.PatientNo,
        labObservationNo: record.LaboratoryNo,
      },
    });
  };

  return (
    <div style={{ margin: '20px 10px 10px 10px' }}>
      <Space
        style={{
          color: '#0f5689',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          paddingBottom: '10px',
          position: 'relative',
        }}
      >
        <ProfileOutlined />
        <Typography.Text
          style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '16px' }}
        >
          Laboratory List OutPatients
        </Typography.Text>
      </Space>
      {loadinglabTreatmentHeaders ? (
        <Loading />
      ) : (
        <Table
          bordered
          size="middle"
          columns={columns}
          dataSource={labTreatmentHeadersData}
          className="admit-patient-table"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            position: ['bottom', 'right'],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, pageSize) =>
              handleTableChange({
                current: page,
                pageSize,
                total: pagination.total,
              }),
            onShowSizeChange: (current, size) =>
              handleTableChange({
                current,
                pageSize: size,
                total: pagination.total,
              }),
            style: {
              marginTop: '30px',
            },
          }}
        />
      )}
    </div>
  );
};

export default LabRequests;
