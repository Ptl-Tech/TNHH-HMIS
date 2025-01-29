import { Button, Card, Input, Space, Table, Typography, Select } from 'antd';
import { ProfileOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../../partials/nurse-partials/Loading';
import { getRadiologyList } from '../../../../actions/Doc-actions/getRadiologyList';

const { Option } = Select;

const RadiologyOutPatients = () => {
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Radiology No',
      dataIndex: 'RadiologyNo',
      key: 'RadiologyNo',
      sorter: (a, b) => a.RadiologyNo.localeCompare(b.RadiologyNo),
    },
    {
      title: 'Patient No',
      dataIndex: 'PatientNo',
      key: 'PatientNo',
      sorter: (a, b) => a.PatientNo.localeCompare(b.PatientNo),
    },
    {
      title: 'Patient Names',
      dataIndex: 'names',
      key: 'names',
      sorter: (a, b) => {
        const nameA = `${a.Surname} ${a.MiddleName} ${a.LastName}`.toLowerCase();
        const nameB = `${b.Surname} ${b.MiddleName} ${b.LastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      },
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() => handleNavigate(record)}
            style={{ color: '#0f5689' }}
          >
            {`${record.Surname} ${record.MiddleName} ${record.LastName}`}
          </Button>
        );
      },
    },
    {
      title: 'Radiology Date',
      dataIndex: 'RadiologyDate',
      key: 'RadiologyDate',
      sorter: (a, b) => new Date(a.RadiologyDate) - new Date(b.RadiologyDate),
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      sorter: (a, b) => a.Status.localeCompare(b.Status),
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
          case 'Cancelled':
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
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => {
        return (
          <Button
            type="primary"
            onClick={() => handleNavigate(record)}
          >
            View Request
          </Button>
        );
      },
    },
  ];


  const dispatch = useDispatch();

  const { loading, data } = useSelector((state) => state.getRadiologyList);

  useEffect(() => {
    if (!data.length) {
      dispatch(getRadiologyList());
    }
  }, [dispatch, data.length]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: data.length,
  });

  const [searchCategory, setSearchCategory] = useState('name');
  const [searchValue, setSearchValue] = useState('');

  const handleNavigate = (record) => {
    navigate({
      pathname: `/Radiology/Radiology-Patient`,
      search: `?radiologyNo=${record.RadiologyNo}&status=${record.Status}`,
    });
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  // Filtered data computation with useMemo
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (searchCategory === 'name') {
        const fullName = `${item.Surname} ${item.MiddleName} ${item.LastName}`.toLowerCase();
        return fullName.includes(searchValue.toLowerCase());
      }
      if (searchCategory === 'patientNo') {
        return item.PatientNo.toLowerCase().includes(searchValue.toLowerCase());
      }
      if (searchCategory === 'radiologyNo') {
        return item.RadiologyNo?.toLowerCase().includes(searchValue.toLowerCase());
      }
      return false;
    });
  }, [data, searchCategory, searchValue]);

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
          Radiology List OutPatients
        </Typography.Text>
      </Space>

      <Card style={{ padding: '10px 10px 10px 10px' }}>
        <div className="admit-patient-filter-container" style={{ display: 'flex', gap: '4px', alignItems: 'center', width: "50vw" }}>
          <Select
            defaultValue="name"
            style={{ width: 200 }}
            onChange={(value) => setSearchCategory(value)}
          >
            <Option value="name">Search by Name</Option>
            <Option value="patientNo">Search by Patient No</Option>
            <Option value="radiologyNo">Search by Radiology Number</Option>
          </Select>
          <Input
            placeholder={`Search by ${searchCategory}`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            allowClear
            suffix={
              <SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            }
          />
        </div>
      </Card>
      {loading ? (
        <Loading />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData}
          className="admit-patient-table"
          bordered
          size="middle"
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

export default RadiologyOutPatients;
