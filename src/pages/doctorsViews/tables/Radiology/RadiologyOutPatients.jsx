import { Button, Card, Input, Space, Table, Typography } from 'antd';
import { ProfileOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../../partials/nurse-partials/Loading';
import { getRadiologyList } from '../../../../actions/Doc-actions/getRadiologyList';

const RadiologyOutPatients = () => {
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Radiology No',
      dataIndex: 'RadiologyNo',
      key: 'RadiologyNo',
    },
    {
      title: 'Patient No',
      dataIndex: 'PatientNo',
      key: 'PatientNo',
    },
    {
      title: 'Patient Names',
      dataIndex: 'names',
      key: 'names',
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
    },
    {
      title: 'status',
      dataIndex: 'Status',
      key: 'Status',
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
  }, [dispatch]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: data.length,
  });

  const handleNavigate = (record) => {
    console.log('records from table', record);

    navigate({
      pathname: `/Radiology/Radiology-Patient`,
      search: `?radiologyNo=${record.RadiologyNo}`,
    });
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination); // Update pagination settings
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
          Radiology List OutPatients
        </Typography.Text>
      </Space>

      <Card style={{ padding: '10px 10px 10px 10px' }}>
        <div className="admit-patient-filter-container">
          <Input
            placeholder="search by name"
            allowClear
            showCount
            showSearch
          />
          <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold' }}>
            or
          </span>
          <Input
            placeholder="search by patient no"
            allowClear
            showCount
            showSearch
          />
          <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold' }}>
            or
          </span>
          <Input
            placeholder="search by id number"
            allowClear
            showCount
            showSearch
          />
        </div>
      </Card>
      {loading ? (
        <Loading />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
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
