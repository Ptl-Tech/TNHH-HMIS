import { Button, Card, Input, Space, Table, Typography, Select, Tabs } from 'antd';
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
            style={{ color: '#b96000' }}
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

  const [searchCategory, setSearchCategory] = useState('name');
  const [searchValue, setSearchValue] = useState('');
  const [selectedTabKey, setSelectedTabKey] = useState('1'); // Track the selected tab

  const handleNavigate = (record) => {
    navigate({
      pathname: `/Dashboard/Radiology-Patient`,
      search: `?radiologyNo=${record.RadiologyNo}&status=${record.Status}`,
    });
  };

  // Filter the data by status and search criteria
  const filteredData = useMemo(() => {
    let statusFilteredData = data.filter((item) => {
      if (selectedTabKey === '1') return item.Status === 'New';
      if (selectedTabKey === '2') return item.Status === 'Cancelled';
      if (selectedTabKey === '3') return item.Status === 'Completed';
      if (selectedTabKey === '4') return item.Status === 'Forwarded';
      return true; // If no tab is selected, show all
    });

    // Apply search filter
    return statusFilteredData.filter((item) => {
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
  }, [data, selectedTabKey, searchCategory, searchValue]);

  // Handle tabs change
  const handleTabChange = (key) => {
    setSelectedTabKey(key); // Update selected tab
  };

  return (
    <div style={{ margin: '20px 10px 10px 10px' }}>
      <Space
        style={{
          color: '#b96000',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          paddingBottom: '10px',
          position: 'relative',
        }}
      >
        <ProfileOutlined />
        <Typography.Text
          style={{ fontWeight: 'bold', color: '#b96000', fontSize: '16px' }}
        >
          Radiology List OutPatients
        </Typography.Text>
      </Space>

      <Card style={{ padding: '10px 10px 10px 10px' }}>
        <div className="admit-patient-filter-container" style={{ display: 'flex', gap: '4px', alignItems: 'center', width: '50vw' }}>
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
            suffix={<SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
          />
        </div>
      </Card>

      {loading ? (
        <Loading />
      ) : (
        <Tabs defaultActiveKey="1" onChange={handleTabChange}>
          <Tabs.TabPane tab="New" key="1">
            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={{ pageSize: 10 }}
              rowKey="RadiologyNo"
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Cancelled" key="2">
            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={{ pageSize: 10 }}
              rowKey="RadiologyNo"
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Completed" key="3">
            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={{ pageSize: 10 }}
              rowKey="RadiologyNo"
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Forwarded" key="4">
            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={{ pageSize: 10 }}
              rowKey="RadiologyNo"
            />
          </Tabs.TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default RadiologyOutPatients;
